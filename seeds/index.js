
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Bharat-Trails')
    .then(() => {
        console.log('MongoDB connection open');
    })
    .catch(err => {
        console.log('MongoDB connection error:', err);
    });
const Campground = require('../models/campground');
const cities = require('./cities');
const seedDB = async () => {
    await Campground.deleteMany({});

    for (const city of cities) {
        const destination = new Campground({
            title: city.title,
            location: `${city.city}, ${city.state}`,
            description: city.description,
            geometry: {
                type: "Point",
                coordinates: [city.longitude, city.latitude]
            },
            image: "/seeds/" + city.city.toLowerCase() + ".jpg",
        });

        await destination.save();
    }
};


seedDB().then(() => {
    mongoose.connection.close();
}); 