const mongoose = require('mongoose');

// to access the mongoose schema method we need to create a constant Schema.
const Schema = mongoose.Schema;

// actual schema
const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // image: URL address.
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    // ref => mongoose.model('User') in user.js file.
    // "mongoose.Types.ObjectId" with that the creator will
    // be a real ID that has to be provided here.
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

// 'Place' will be created as 'places' as a "collection name" in DB.
// Second argument is the schema which we refer.
module.exports = mongoose.model('Place', placeSchema);