const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const carsModelSchema = new Schema({
    car_make_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarsMake"
    },
    car_model_name: {
        type: String,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

const CarsModel = mongoose.model('cars_models', carsModelSchema)

module.exports = CarsModel;