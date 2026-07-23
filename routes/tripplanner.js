const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Show the planner form
router.get('/', (req, res) => {
    res.render('trip-planner', { plan: null, formData: {}, errorMsg: null });
});

// Generate a plan via the Anthropic API
router.post('/', catchAsync(async (req, res) => {
    const { destination, days, budget, interests, travelStyle } = req.body;
    const formData = { destination, days, budget, interests, travelStyle };

    if (!destination || !days) {
        return res.status(400).render('trip-planner', {
            plan: null,
            formData,
            errorMsg: 'Please provide at least a destination and number of days.'
        });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).render('trip-planner', {
            plan: null,
            formData,
            errorMsg: 'AI Trip Planner is not configured. Ask the site admin to set ANTHROPIC_API_KEY.'
        });
    }

    const prompt = `You are a travel planner specializing in Indian destinations for the BharatTrails app.
Create a ${days}-day trip itinerary for ${destination}, India.
Budget: ${budget || 'not specified'}.
Traveler interests: ${interests || 'general sightseeing'}.
Travel style: ${travelStyle || 'balanced'}.

Respond with ONLY valid JSON, no markdown code fences, no commentary, in exactly this shape:
{
  "destination": string,
  "summary": string (2-3 sentences),
  "days": [
    { "day": number, "title": string, "activities": [string, string, string] }
  ],
  "tips": [string, string, string]
}`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
                max_tokens: 2000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Anthropic API error:', response.status, errText);
            return res.status(502).render('trip-planner', {
                plan: null,
                formData,
                errorMsg: 'The AI planner is temporarily unavailable. Please try again shortly.'
            });
        }

        const data = await response.json();
        const rawText = (data.content || [])
            .map(block => block.text || '')
            .join('')
            .trim();
        const cleaned = rawText.replace(/^```json\s*|^```\s*|```$/g, '').trim();

        let plan;
        try {
            plan = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('Failed to parse AI response as JSON:', rawText);
            return res.status(502).render('trip-planner', {
                plan: null,
                formData,
                errorMsg: 'The AI planner returned an unexpected response. Please try again.'
            });
        }

        res.render('trip-planner', { plan, formData, errorMsg: null });
    } catch (err) {
        console.error('AI Trip Planner error:', err);
        res.status(500).render('trip-planner', {
            plan: null,
            formData,
            errorMsg: 'Something went wrong generating your trip plan. Please try again.'
        });
    }
}));

module.exports = router;
