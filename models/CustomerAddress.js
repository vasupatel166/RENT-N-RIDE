const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const customerAddressSchema = new Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    street_address_line_1: String,
    street_address_line_2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
});

const CustomerAddress = mongoose.model('customer_address', customerAddressSchema)

module.exports = CustomerAddress;