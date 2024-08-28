const getCarDetails = require("./getCarDetails");

module.exports = async (req, res) => {
    // Call the getCarDetails function to fetch data
    await getCarDetails(req, res, { route: "allCarsPage" });
};