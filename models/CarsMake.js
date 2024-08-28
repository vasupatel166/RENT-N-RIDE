const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const carsMakeSchema = new Schema({
    car_make_name: {
        type: String
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

const CarsMake = mongoose.model('cars_makes', carsMakeSchema)

module.exports = CarsMake;