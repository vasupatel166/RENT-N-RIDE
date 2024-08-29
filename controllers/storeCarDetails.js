const Cars = require("../models/Cars");
const path = require('path');
const CarsMake = require("../models/CarsMake");
const CarsModel = require("../models/CarsModel");
const { validateCarDetails, getPrevoiusCarDetailsOnError } = require("../utils/validation");

module.exports = async (req, res) => {
    try {

        const carDetails = req.body;

        console.log(" Car Details ", carDetails);

        const { errors, hasError } = await validateCarDetails(carDetails);

        if (hasError) {
            const carsData = await getPrevoiusCarDetailsOnError(carDetails);

            res.render("add_car", {
                carsData: carsData,
                carMakeId: carDetails.inputCarMake || "",
                carModelId: carDetails.inputCarModel || "",
                carsMakeData: "",
                storeCarDetails_validation: true,
                car_error: Object.values(errors).find(error => error !== "")
            });

            return;
        }

        let image = req.files.inputCarImage;

        if (image) {
            image.mv(path.resolve(__dirname, '../', 'public/assets/car-images', image.name));
        }

        // Create a new car entry
        const newCar = await Cars.create({
            car_make_id: carDetails.inputCarMake,
            car_model_id: carDetails.inputCarModel,
            year: carDetails.inputCarYear,
            color: carDetails.inputCarColor,
            seats: carDetails.inputCarSeats,
            fuel_type: carDetails.inputCarFuelType,
            mileage: carDetails.inputCarMileage,
            rental_rate: parseFloat(carDetails.inputCarRent).toFixed(2),
            is_available: true,
            image: image ? image.name : "",
            admin_id: req.session.adminId,
        });

        console.log(`Car added >>>>> ${newCar}`);
        return res.redirect('/cars-on-rent');

    } catch (error) {
        console.log("Error: Data Creation", error);
        return res.redirect("/");
    }
};
