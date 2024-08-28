const puppeteer = require('puppeteer');
const path = require('path');
const querystring = require('querystring');

module.exports = async (req, res) => {
    try {
        const reportData = req.query.reportData;

        console.log("Query Data :", reportData);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const reportUrl = `${req.protocol}://${req.get('host')}/viewReport?reportData=${querystring.escape(reportData)}`;
        // console.log("Report URL", reportUrl);
        await page.goto(reportUrl, { waitUntil: "networkidle2" });
        await page.setViewport({ width: 1800, height: 800 });
        const pdf = await page.pdf({
            path: path.join(__dirname, '../reports', "Booked_Cars_Report.pdf"),
            printBackground: true,
            format: "A4"
        });
        await browser.close();
        const pdfURL = path.join(__dirname, '../Booked Car Report.pdf');
        res.download(pdfURL, function (err) {
            if (err) {
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}
