const Cars = require("../models/Cars");
const path = require('path');
const fs = require('fs');
const { validateCarDetails, getPrevoiusCarDetailsOnError } = require("../utils/validation");

module.exports = async (req, res) => {
    try {

        const carId = req.session.carId;
        const carData = await Cars.findById(carId);

        const carDetails = req.body;
        const { errors, hasError } = await validateCarDetails(carDetails);

        if (hasError) {
            const carsData = await getPrevoiusCarDetailsOnError(carDetails);

            res.render("add_car", {
                carsData: carsData,
                carMakeId: carDetails.inputCarMake || "",
                carModelId: carDetails.inputCarModel || "",
                carsMakeData: "",
                storeCarDetails_validation: false,
                car_error: Object.values(errors).find(error => error !== "")
            });

            return;
        }

        let image = '';

        if (req.files && req.files.inputCarImage && req.files.inputCarImage.name) {
            image = req.files.inputCarImage;

            // remove old image
            if (carData.image) {
                const oldImagePath = path.resolve(__dirname, '../', 'public/assets/car-images', carData.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // save new image
            image.mv(path.resolve(__dirname, '../', 'public/assets/car-images', image.name))
            image = image.name;
        } else {
            image = carData.image;
        }

        console.log("Image", image);

        carData.car_make_id = carDetails.inputCarMake;
        carData.car_model_id = carDetails.inputCarModel;
        carData.year = carDetails.inputCarYear;
        carData.color = carDetails.inputCarColor;
        carData.seats = carDetails.inputCarSeats;
        carData.fuel_type = carDetails.inputCarFuelType;
        carData.mileage = carDetails.inputCarMileage;
        carData.rental_rate = parseFloat(carDetails.inputCarRent).toFixed(2);
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
