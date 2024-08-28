const Admin = require("../models/Admin");

module.exports = async (req, res) => {
    const { admin_firstname, admin_lastname, admin_email, admin_password } = req.body;

    // Validate input fields
    if (!admin_firstname || !admin_lastname || !admin_email || !admin_password) {
        const errors = {
            admin_firstname: !admin_firstname ? "Please enter firstname" : "",
            admin_lastname: !admin_lastname ? "Please enter lastname" : "",
            admin_email: !admin_email ? "Please enter your email" : "",
            admin_password: !admin_password ? "Please enter password" : "",
        };

        res.render("signup", {
            signup_error: Object.values(errors).find(error => error !== ""),
            firstname: admin_firstname || "",
            lastname: admin_lastname || "",
            email: admin_email || "",
            password: ""
        });

        return;
    }

    // Check if admin already exists
    const adminExist = await Admin.findOne({ email: admin_email });
    if (adminExist) {
        res.render("signup", {
            signup_error: "Admin already exists",
            firstname: "",
            lastname: "",
            email: "",
            password: ""
        });
        return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
    if (!passwordRegex.test(admin_password)) {
        res.render("signup", {
            signup_error: "Password must contain at least one uppercase letter, one lowercase letter, one number, one symbol, and be at least 10 characters long",
            firstname: admin_firstname,
            lastname: admin_lastname,
            email: admin_email,
            password: ""
        });
        return;
    }

    // Create a new admin
    const newAdmin = await Admin.create({
        firstname: admin_firstname,
        lastname: admin_lastname,
        email: admin_email,
        password: admin_password
    });

    console.log(`Admin added >>>>> ${newAdmin}`);
    return res.redirect("/login");
};
