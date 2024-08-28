//Module
const express = require("express");
const mongoose = require('mongoose');
const expressSession = require('express-session');
const fileUpload = require('express-fileupload')
const env = require('dotenv').config();

// Controllers
const addCarPageController = require("./controllers/addCar")
const viewCarsRentPageController = require("./controllers/carsOnRent")
const getCarDetailsController = require("./controllers/getCarDetails")
const reportsPageController = require("./controllers/reports")
const downloadReportController = require("./controllers/downloadReport")
const loginPageController = require("./controllers/login")
const loginAdminController = require("./controllers/loginAdmin")
const signupPageController = require("./controllers/signup")
const signupAdminController = require("./controllers/signupAdmin")
const storeCarDetailsController = require("./controllers/storeCarDetails")
const updateCarDetailsController = require("./controllers/updateCarDetails")
const adminLogoutController = require("./controllers/logout")

//Middleware
const adminAuthMiddleware = require("./middlewares/AdminAuthMiddleware")

//Application
const app = express();
app.use(express.static('public'))
app.use(express.static('reports'))
app.set("view engine", "ejs")
app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }))

app.use(expressSession({
    secret: "This is Car Rental session",
    resave: true,
    saveUninitialized: true
}))

app.use('*', (req, res, next) => {
    loggedIn = req.session.adminId;
    next()
})

// Connection to MongoDB
try {
    const connectionString = env.parsed.MONGO_URI;
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDb Connected!!!');
} catch (err) {
    console.log('MongoDb Not Connected!!!')
}

// Routes

// 1. Add Cars Page
app.get("/", adminAuthMiddleware, addCarPageController)

// 2. View Cars Page
app.get("/cars-on-rent", adminAuthMiddleware, viewCarsRentPageController)

// 3. Get Cars Details Page
app.post("/getCarDetails", getCarDetailsController)

// 4. Reports Page 
app.get("/reports", adminAuthMiddleware, reportsPageController)

app.get("/viewReport", (req, res) => {
    const reportData = req.query.reportData;
    console.log("Report Data When Download click:", reportData);
    res.render("report_template", { reportData: reportData ? JSON.parse(reportData) : "" });
});

app.post("/downloadReport", adminAuthMiddleware, downloadReportController)

// 5. Login Page
app.get("/login", loginPageController)

// 6. Signup Page
app.get("/signup", signupPageController)

// 7. Logout Admin
app.get('/logout', adminLogoutController)

app.post("/login", loginAdminController)

// 8. Controller to add new user in database
app.post("/signup", signupAdminController)

app.post("/storeCarDetails", storeCarDetailsController)

app.post("/updateCarDetails", updateCarDetailsController)

app.listen(env.parsed.PORT, () => {
    console.log("Application link : http://localhost:" + env.parsed.PORT + "/");
});