const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const Campground = require('../models/campground');
const Review = require('../models/review');
const validateCampground = require('../utils/validateCampground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const { isAuthor } = require('../middleware');

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
router.post('/', isLoggedIn, upload.array('image'), catchAsync(async (req, res) => {
  const campgroundData = req.body.campground || req.body;
  const errors = validateCampground(campgroundData);
  if (errors.length) {
    return res.status(400).render('campgrounds/new', { errors, campground: campgroundData });
  }
  const campground = new Campground(campgroundData);
  campground.author = req.user._id;
  if (req.files && req.files.length) {
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  }
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));
// Show
const ExpressError = require('../utils/ExpressError');
const { url } = require('inspector');

router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");

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
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
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
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(async (req, res, next) => {
  try {

    console.log('req.files:', req.files);
    const campgroundData = req.body.campground || req.body;

    const errors = validateCampground(campgroundData);
    if (errors.length) {
      return res.status(400).render('campgrounds/edit', {
        errors,
        campground: { ...campgroundData, _id: req.params.id }
      });
    }
    const { title, price, description, location } = campgroundData;


    const result = await Campground.findByIdAndUpdate(req.params.id, { title, price, description, location }, { returnDocument: 'after', runValidators: true });
    if (!result) {
      throw new ExpressError('Campground not found', 404);

    }
    if (req.files && req.files.length) {
      // Delete every existing image from Cloudinary before replacing them
      if (result.images && result.images.length) {
        for (let img of result.images) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
      // Overwrite the array entirely with the newly uploaded images
      result.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    }


    await result.save();
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

// Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Campground.findByIdAndDelete(req.params.id);
    if (!result) {
      throw new ExpressError('Campground not found', 404);
    }
    await Review.deleteMany({ campground: id });
    req.flash('success', 'Destination deleted successfully.');
    res.redirect('/campgrounds');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new ExpressError('Invalid campground ID', 404));
    }
    throw err;
  }
}));

module.exports = router;