const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const carRentalsSchema = new Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    invoice_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    rental_start_date: Date,
    rental_start_time: String,
    rental_end_date: Date,
    rental_end_time: String,
    rental_cost: Number,
    rental_tax: Number,
    total_cost_after_tax: Number
});

const CarRentals = mongoose.model('car_rentals', carRentalsSchema)

module.exports = CarRentals;