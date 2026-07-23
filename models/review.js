const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  body: {
    type: String,
    required: true,
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: 'Campground',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
