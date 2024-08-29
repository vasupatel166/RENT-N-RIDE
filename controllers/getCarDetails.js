const Cars = require("../models/Cars");
const CarsMake = require("../models/CarsMake");
const CarsModel = require("../models/CarsModel");
const Customers = require("../models/Customers");
const Invoices = require("../models/Invoices");
const downloadReport = require("./downloadReport");

module.exports = async (req, res, { route, getCarMakes }) => {

    let req_route = route;
    let carMakeId = "";
    let isCarMakes = getCarMakes;
    let carId = req.body.carId;
    let isEditCar = false;
    let report_type = req.body.report_type;

    if (report_type) {
        req_route = "reportPage"
    }

    if (req.body.carMakeId) {
        req_route = "addCarPage";
        carMakeId = req.body.carMakeId
        isCarMakes = 0;
    }

    if (carId) {
        req_route = "allCarsPage";
        isEditCar = true;
    }

    console.log(`Route : ${req_route}, isEditCar : ${isEditCar}`);

    switch (req_route) {

        case "addCarPage":
            try {
                if (isCarMakes) {

                    const carsMakeData = await CarsMake.find({});

                    if (carsMakeData) {
                        res.render('add_car', { carsMakeData: carsMakeData, carsData: "", carMakeId: "", carModelId: "", storeCarDetails_validation: false, car_error: "" });
                    } else {
                        console.error("Cars Make Data Not Found !!!");
                        res.render('add_car');
                    }

                } else if (carMakeId) {
                    const carsModelData = await CarsModel.find({ car_make_id: carMakeId });

                    if (carsModelData) {
                        // console.log(`Cars Model data :,${carsModelData}`);
                        return res.status(200).json({ carsModelData: carsModelData });
                    } else {
                        console.error("Cars Model Data Not Found !!!");
                        res.render('add_car');
                    }
                } else {
                    console.log("Car Parameters Not Found !!!");
                    res.render('add_car');
                }
            } catch (error) {
                console.log(error);
            }

            break;

        case "allCarsPage":
            try {

                let carsData;
                let carMakeId;
                let carModelId;

                if (isEditCar) {
                    req.session.carId = carId;
                    const car = await Cars.findById({ _id: carId });
                    carsData = car ? [car] : [];
                } else {
                    carsData = await Cars.find({});
                }

                const result = [];

                for (const car of carsData) {

                    const carsMake = !isEditCar ? await CarsMake.findById({ _id: car.car_make_id }) : await CarsMake.find({});
                    const carsModel = !isEditCar ? await CarsModel.findById({ _id: car.car_model_id }) : await CarsModel.find({ car_make_id: car.car_make_id });

                    const carDetails = {
                        _id: car._id,
                        ...(isEditCar ? { carsMake: carsMake } : { car_make_name: carsMake.car_make_name }),
                        ...(isEditCar ? { carsModel: carsModel } : { car_model_name: carsModel.car_model_name }),
                        color: car.color,
                        year: car.year,
                        fuel_type: car.fuel_type,
                        mileage: car.mileage,
                        seats: car.seats,
                        rental_rate: car.rental_rate,
                        is_available: car.is_available,
                        image: car.image
                    };

                    result.push(carDetails);
                }

                carsData.forEach(item => {
                    carMakeId = item.car_make_id;
                    carModelId = item.car_model_id;
                })

                if (result) {
                    isEditCar ? res.render('add_car', { carsData: result, carMakeId: carMakeId, carModelId: carModelId, carsMakeData: "", storeCarDetails_validation: false, car_error: "" }) : res.render('cars_on_rent', { carsData: result });
                } else {
                    console.log("No Cars On Rent !!!");
                    res.render('add_car', { carsData: "", carMakeId: "", carModelId: "", storeCarDetails_validation: false, car_error: "" });
                }

            } catch (error) {
                console.log(error);
            }

            break;

        case "reportPage":
            try {

                let carsData = await Cars.find({ is_available: false });
                let carsRentals = await CarRentals.find({});
                const customerIds = carsRentals.map(rental => rental.customer_id);
                const customers = await Customers.find({ _id: { $in: customerIds } });

                // console.log(`Cars Rentals : ${carsRentals}, Customers : ${customers}`);

                const result = [];

                for (const car of carsData) {

                    const carMake = await CarsMake.findById(car.car_make_id).select('car_make_name');
                    const carModel = await CarsModel.findById(car.car_model_id).select('car_model_name');
                    // console.log(`Cars Make : ${carMake} , Car Model : ${carModel}`);

                    const carDetails = {
                        carMake: carMake.car_make_name,
                        carModel: carModel.car_model_name,
                        year: car.year,
                        image: car.image
                    };

                    result.push(carDetails);
                }

                for (const customer of customers) {

                    const customerDetails = {
                        customer_firstname: customer.firstname,
                        customer_lastname: customer.lastname,
                        customer_email: customer.email,
                    }

                    result.push(customerDetails);
                }

                for (const car_rental of carsRentals) {

                    const carRentalDetails = {
                        rental_start_date: car_rental.rental_start_date,
                        rental_start_time: car_rental.rental_start_time,
                        rental_end_date: car_rental.rental_end_date,
                        rental_end_time: car_rental.rental_end_time,
                    }

                    result.push(carRentalDetails);
                }

                if (result.length > 0) {
                    console.log("Result of report data", result);
                    // res.render("report_template", { reportData: result });
                    // await downloadReport({ result });
                    return res.status(200).json({ reportData: result });
                } else {
                    console.error("Data Not Found !!!");
                    res.render('report_template');
                }

            } catch (error) {
                console.log(error);
            }
            break;

        default:
            console.error("Error : Not get the route");
            break;
    }


}