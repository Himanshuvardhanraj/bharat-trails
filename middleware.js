const Campground = require('./models/campground');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit this campground.');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!review.authorId || !review.authorId.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this review');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}