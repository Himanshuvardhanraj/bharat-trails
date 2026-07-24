const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);
campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});




module.exports = mongoose.model('Campground', campgroundSchema);


