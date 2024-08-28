const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

//create shema
const adminSchema = new Schema({
    firstname: {
        type: String,
        default: "demo_firstname"
    },
    lastname: {
        type: String,
        default: "demo_lastname"
    },
    email: {
        type: String,
        default: "demo@example.com"
    },
    password: {
        type: String,
        default: "demo_password"
    }
});


adminSchema.pre('save', function (next) {
    const admin = this;

    if (!admin.isModified('password')) {
        return next();
    }
    // Hashing the password
    bcrypt.hash(admin.password, 5, (error, hash) => {
        if (error) {
            return next(error);
        }
        admin.password = hash;
        next();
    });
});

const Admin = mongoose.model('admins', adminSchema)

module.exports = Admin;