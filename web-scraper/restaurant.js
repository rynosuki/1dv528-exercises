exports.scrapeRestaurant = (url) => processReservations(url);

const https = require("https");

function processReservations(url) {
  process.stdout.write("Scraping possible reservations...");
  https.get(url, (res) => {
    let dataString = "";
    res.on("data", (chunk) => {
      dataString += chunk;
    });

    res.on("end", () => {
      scrape("confirmation");
    });
  });
  process.stdout.write("OK!\n");
}