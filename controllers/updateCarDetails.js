const Cars = require("../models/Cars");
const path = require('path')

module.exports = async (req, res) => {
    try {

        const carId = req.session.carId;
        const carData = await Cars.findById(carId);

        console.log("Car Data", carData);

        let image = '';

        if (req.files && req.files.inputCarImage && req.files.inputCarImage.name) {
            image = req.files.inputCarImage;
            image.mv(path.resolve(__dirname, '../', 'public/assets/car-images', image.name))
            image = image.name;
        } else {
            image = carData.image;
        }

        console.log("Image", image);

        carData.car_make_id = req.body.inputCarMake;
        carData.car_model_id = req.body.inputCarModel;
        carData.year = req.body.inputCarYear;
        carData.color = req.body.inputCarColor;
        carData.seats = req.body.inputCarSeats;
        carData.fuel_type = req.body.inputCarFuelType;
        carData.mileage = req.body.inputCarMileage;
        carData.rental_rate = req.body.inputCarRent;
        carData.image = image;
        carData.admin_id = req.session.adminId;

        // Save the updated user data
        await carData.save();

        console.log("Data after update : ", carData);

        res.redirect("/cars-on-rent");

    } catch (error) {
        console.error("Error updating car details:", error);
        res.status(500).send("Error updating car details");
    }
};
