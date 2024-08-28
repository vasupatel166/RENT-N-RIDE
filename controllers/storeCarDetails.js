const Cars = require("../models/Cars");
const path = require('path');

module.exports = async (req, res) => {
    try {
        const { inputCarMake, inputCarModel, inputCarYear, inputCarColor, inputCarSeats, inputCarFuelType, inputCarMileage, inputCarRent, inputCarImage } = req.body;

        let image = inputCarImage;

        // Move image to the correct directory if it exists
        if (image) {
            image.mv(path.resolve(__dirname, '../', 'public/assets/car-images', image.name));
        }

        // Get the current year for validation
        const currentYear = new Date().getFullYear();

        // Validate input fields
        let errors = {
            inputCarMake: !inputCarMake ? "Please enter car make" : "",
            inputCarModel: !inputCarModel ? "Please enter car model" : "",
            inputCarYear: !inputCarYear || inputCarYear.length !== 4 || inputCarYear < 1000 || inputCarYear > currentYear ? `Please enter a valid car year (between 1000 and ${currentYear})` : "",
            inputCarColor: !inputCarColor ? "Please enter car color" : "",
            inputCarSeats: !inputCarSeats || inputCarSeats < 2 ? "Please enter a valid number of seats (at least 2)" : "",
            inputCarFuelType: !inputCarFuelType ? "Please enter fuel type" : "",
            inputCarMileage: !inputCarMileage ? "Please enter car mileage" : "",
            inputCarRent: !inputCarRent || inputCarRent < 20 ? "Please enter a valid car rent (at least 20)" : ""
        };

        // Check if there are any validation errors
        const hasError = Object.values(errors).some(error => error !== "");

        if (hasError) {
            res.render("/", {
                car_error: Object.values(errors).find(error => error !== ""),
                car_make: inputCarMake || "",
                car_model: inputCarModel || "",
                car_year: inputCarYear || "",
                car_color: inputCarColor || "",
                car_seats: inputCarSeats || "",
                car_fuel_type: inputCarFuelType || "",
                car_mileage: inputCarMileage || "",
                car_rent: inputCarRent || "",
                car_image: image ? image.name : ""
            });
            return;
        }

        // Create a new car entry
        const newCar = await Cars.create({
            car_make_id: inputCarMake,
            car_model_id: inputCarModel,
            year: inputCarYear,
            color: inputCarColor,
            seats: inputCarSeats,
            fuel_type: inputCarFuelType,
            mileage: inputCarMileage,
            rental_rate: inputCarRent,
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
