const Joi = require('joi');

const reviewSchema = Joi.object({
  author: Joi.string().trim().required().messages({
    'string.empty': 'Your name is required',
    'any.required': 'Your name is required'
  }),
  body: Joi.string().trim().required().messages({
    'string.empty': 'Review text is required',
    'any.required': 'Review text is required'
  }),
  rating: Joi.any().required().custom((value, helpers) => {
    const trimmed = value !== undefined && value !== null ? String(value).trim() : '';
    if (trimmed === '') {
      return helpers.error('any.required');
    }
    const number = Number(trimmed);
    if (Number.isNaN(number) || !Number.isInteger(number)) {
      return helpers.error('number.integer');
    }
    if (number < 1 || number > 5) {
      return helpers.error('number.range');
    }
    return number;
  }, 'Rating validation').messages({
    'any.required': 'Rating is required',
    'number.integer': 'Rating must be an integer between 1 and 5',
    'number.range': 'Rating must be between 1 and 5'
  })
}).options({ allowUnknown: true, abortEarly: false });

function validateReview(review = {}) {
  const { error } = reviewSchema.validate(review);
  return error ? error.details.map(detail => detail.message) : [];
}

module.exports = validateReview;
