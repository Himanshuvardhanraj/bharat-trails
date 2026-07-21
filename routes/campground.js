const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Review = require('../models/review');
const validateCampground = require('../utils/validateCampground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

// Index - list campgrounds
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

// New form
router.get('/new', isLoggedIn, (req, res) => {

  res.render('campgrounds/new', { errors: [], campground: {} });
});

// Create
router.post('/', isLoggedIn, catchAsync(async (req, res) => {
  const campgroundData = req.body.campground || req.body;
  const errors = validateCampground(campgroundData);
  if (errors.length) {
    return res.status(400).render('campgrounds/new', { errors, campground: campgroundData });
  }
  const campground = new Campground(campgroundData);
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

// Show
const ExpressError = require('../utils/ExpressError');

router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      throw new ExpressError('Campground not found', 404);
    }
    const reviews = await Review.find({ campground: req.params.id }).sort({ createdAt: -1 });
    res.render('campgrounds/show', { campground, reviews, errors: [], review: {} });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

// Edit form
router.get('/:id/edit', catchAsync(async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      throw new ExpressError('Campground not found', 404);
    }
    res.render('campgrounds/edit', { campground, errors: [] });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

// Update
router.put('/:id', catchAsync(async (req, res, next) => {
  try {
    const campgroundData = req.body.campground || req.body;
    const errors = validateCampground(campgroundData);
    if (errors.length) {
      return res.status(400).render('campgrounds/edit', {
        errors,
        campground: { ...campgroundData, _id: req.params.id }
      });
    }
    const { title, price, description, location } = campgroundData;
    const result = await Campground.findByIdAndUpdate(req.params.id, { title, price, description, location });
    if (!result) {
      throw new ExpressError('Campground not found', 404);
    }
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

// Delete
router.delete('/:id', catchAsync(async (req, res, next) => {
  try {
    const result = await Campground.findByIdAndDelete(req.params.id);
    if (!result) {
      throw new ExpressError('Campground not found', 404);
    }
    res.redirect('/campgrounds');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

module.exports = router;