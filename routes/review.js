const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const validateReview = require('../utils/validateReview');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isReviewAuthor } = require('../middleware');

// Create review
router.post('/', isLoggedIn, catchAsync(async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      throw new ExpressError('Campground not found', 404);
    }
    const reviewData = req.body.review || req.body;
    reviewData.campground = req.params.id;
    reviewData.author = req.user.username;
    reviewData.authorId = req.user._id;

    const errors = validateReview(reviewData);
    if (errors.length) {
      const reviews = await Review.find({ campground: req.params.id }).sort({ createdAt: -1 });
      return res.status(400).render('campgrounds/show', {
        campground,
        reviews,
        errors,
        review: reviewData
      });
    }
    const review = new Review(reviewData);
    await review.save();
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

// Delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid ID', 404));
    }
    throw err;
  }
}));

module.exports = router;
