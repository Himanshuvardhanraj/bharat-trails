// One-time cleanup script: removes the old, broken singular "image" field
// that was hardcoded in seeds/index.js before it was fixed.
// This does NOT delete campgrounds, reviews, or the "images" array field —
// it only strips the leftover bad "image" field.
//
// Usage:
//   node scripts/removeOldImageField.js

const mongoose = require('mongoose');
const Campground = require('../models/campground');

async function run() {
    await mongoose.connect('mongodb://localhost:27017/Bharat-Trails');
    console.log('MongoDB connection open');

    const result = await Campground.updateMany(
        { image: { $exists: true } },
        { $unset: { image: "" } }
    );

    console.log(`Done. Cleaned up ${result.modifiedCount} campground(s).`);

    await mongoose.connection.close();
}

run().catch(err => {
    console.error('Error running cleanup script:', err);
    process.exit(1);
});