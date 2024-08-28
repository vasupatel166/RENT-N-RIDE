const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const customersSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    phone: Number,
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const Customers = mongoose.model('customers', customersSchema)

module.exports = Customers;