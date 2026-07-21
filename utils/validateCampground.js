const Joi = require('joi');

const campgroundSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  location: Joi.string().trim().required().messages({
    'string.empty': 'Location is required',
    'any.required': 'Location is required'
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  price: Joi.any().required().custom((value, helpers) => {
    const trimmed = value !== undefined && value !== null ? String(value).trim() : '';
    if (trimmed === '') {
      return helpers.error('any.required');
    }
    const number = Number(trimmed);
    if (Number.isNaN(number)) {
      return helpers.error('number.base');
    }
    if (number < 0) {
      return helpers.error('number.min');
    }
    return number;
  }, 'Price validation').messages({
    'any.required': 'Price is required',
    'number.base': 'Price must be a valid number',
    'number.min': 'Price cannot be negative'
  })
}).options({ allowUnknown: true, abortEarly: false });

function validateCampground(campground = {}) {
  const { error } = campgroundSchema.validate(campground);
  return error ? error.details.map(detail => detail.message) : [];
}

module.exports = validateCampground;
