const Admin = require("../models/Admin");
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const { admin_email, admin_password } = req.body;

        if (!admin_email) {
            return res.render("login", { login_error: "Please enter email", email: "", password: "" });
        }

        const findAdmin = await Admin.findOne({ email: admin_email });

        if (!findAdmin) {
            return res.render("login", { login_error: "Admin not registered", email: admin_email, password: "" });
        }

        if (!admin_password) {
            return res.render("login", { login_error: "Please enter password", email: admin_email, password: "" });
        }

        const passwordMatch = await bcrypt.compare(admin_password, findAdmin.password);

        if (passwordMatch) {
            req.session.adminId = findAdmin._id;
            console.log('Admin Logged In!!!');
            return res.redirect('/');
        } else {
            console.log('Invalid Password!');
            return res.render("login", { login_error: "Password doesn't match", email: admin_email, password: "" });
        }

    } catch (error) {
        console.log("Error during login:", error);
        return res.redirect('/login');
    }
};
