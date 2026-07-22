require('dotenv').config();
const express = require('express');
const app = express();
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
app.use(methodOverride('_method'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Bharat-Trails')
  .then(() => {
    console.log('MongoDB connection open');
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });
const Campground = require('./models/campground');
const Review = require('./models/review');
const validateCampground = require('./utils/validateCampground');
const validateReview = require('./utils/validateReview');

const engine = require('ejs-mate');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const tripPlannerRoutes = require('./routes/tripplanner');

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/trip-planner', tripPlannerRoutes);



app.get('/', (req, res) => {
  console.log('Rendering home page');
  res.render('home');
});
app.get('/why-us', (req, res) => {
  res.render('why-us');
});

app.use((req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Something went wrong on our end';
  res.status(status).render('error', { err });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



