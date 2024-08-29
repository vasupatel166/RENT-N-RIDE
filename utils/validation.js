const CarsMake = require("../models/CarsMake");
const CarsModel = require("../models/CarsModel");

module.exports = {
    validateCarDetails: async (carDetails) => {
        const currentYear = new Date().getFullYear();
        const { inputCarMake, inputCarModel, inputCarYear, inputCarColor, inputCarSeats, inputCarFuelType, inputCarMileage, inputCarRent } = carDetails;

        let errors = {
            inputCarMake: !inputCarMake ? "Please select car make" : "",
            inputCarModel: !inputCarModel ? "Please select car model" : "",
            inputCarYear: !inputCarYear || inputCarYear.length !== 4 || inputCarYear < 2000 || inputCarYear > currentYear ? `Please enter a valid car year (between 2000 and ${currentYear})` : "",
            inputCarColor: !inputCarColor ? "Please enter car color" : "",
            inputCarSeats: !inputCarSeats || inputCarSeats < 2 ? "Please enter a valid number of seats (at least 2)" : "",
            inputCarFuelType: !inputCarFuelType ? "Please select fuel type" : "",
            inputCarMileage: !inputCarMileage ? "Please enter car mileage" : "",
            inputCarRent: !inputCarRent || inputCarRent < 20 ? "Please enter a valid car rent (at least $20)" : ""
        };

        return {
            errors,
            hasError: Object.values(errors).some(error => error !== "")
        };
    },
    getPrevoiusCarDetailsOnError: async (carDetails) => {

        const carsMake = await CarsMake.find({});
        const carsModel = carDetails.inputCarMake ? await CarsModel.find({ car_make_id: carDetails.inputCarMake }) : "";

        const carsData = [{
            carsMake: carsMake,
            carsModel: carsModel,
            year: carDetails.inputCarYear,
            color: carDetails.inputCarColor,
            seats: carDetails.inputCarSeats,
            fuel_type: carDetails.inputCarFuelType,
            mileage: carDetails.inputCarMileage,
            rental_rate: carDetails.inputCarRent,
            image: carDetails.inputCarImage
        }];

        return carsData;
    }
};
