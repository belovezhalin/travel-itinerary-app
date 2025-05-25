const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
});

const routeSchema = new mongoose.Schema({
    coords: [[Number]],
    mode: String
});

const daySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    markers: [markerSchema],
    routes: [routeSchema]
});

const itinerarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    days: [daySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);