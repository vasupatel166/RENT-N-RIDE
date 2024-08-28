module.exports = (req, res) => {
    res.render('signup', {
        signup_error: req.query.signup_error || "",
        firstname: req.query.firstname || "",
        lastname: req.query.lastname || "",
        email: req.query.email || "",
        password: req.query.password || ""
    });
};
