const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const invoiceSchema = new Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    invoice_date: Date,
    amount: Number,
    payment_method: String,
    payment_status: String
});

const Invoices = mongoose.model('invoices', invoiceSchema)

module.exports = Invoices;