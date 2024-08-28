module.exports = (req, res) => {
    res.render('login', {
        login_error: req.query.login_error || "",
        email: req.query.email || "",
        password: req.query.password || ""
    });
};
