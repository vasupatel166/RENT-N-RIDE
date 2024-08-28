const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
    try {
        const findAdmin = await Admin.findOne({ _id: req.session.adminId })

        if (!findAdmin) {
            console.log("Admin not logged in!!");
            return res.redirect('/login')
        } else {
            next();
        }
    }
    catch (err) {
        console.error('Error: Admin not found!!', err);
        return res.redirect('/')
    }
};
