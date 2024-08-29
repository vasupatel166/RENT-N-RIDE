const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Decimal128 = mongoose.Types.Decimal128;

//create schema
const carsSchema = new Schema({
    car_make_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarsMake"
    },
    car_model_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarsModel"
    },
    year: {
        type: Number
    },
    color: {
        type: String
    },
    seats: {
        type: Number
    },
    fuel_type: {
        type: String
    },
    mileage: {
        type: Number
    },
    rental_rate: {
        type: Decimal128
    },
    is_available: {
        type: Boolean
    },
    image: {
        type: String
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

const Cars = mongoose.model('cars', carsSchema)

module.exports = Cars;