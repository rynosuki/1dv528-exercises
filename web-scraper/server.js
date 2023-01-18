console.log("Starting web scraper...");
const url = process.title.toString().split(" ")[2];
let links = [];
let data = "";
let daysAvailable = undefined;
let showTimes = undefined;
let openReservations = undefined;

const scrapeDays = require("./calendar.js");
const scrapeShowtimes = require("./cinema.js");
const scrapeReservations = require("./restaurant.js");
const confirmation = require("./confirmation.js");

const https = require("https");

// const server = https.createServer().listen(3000);
scrape()

async function scrape() {
  processLinks(url);
  daysAvailable = scrapeDays.scrapeCalendar(await getData(links[0]), url);
  showTimes = scrapeShowtimes.scrapeCinema(await getData(links[1]), daysAvailable);
  openReservations = scrapeReservations.scrapeRestaurant(url);
  console.log(
    confirmation.confirmation(daysAvailable, showTimes, openReservations)
  );
}

function processLinks(url) {
  process.stdout.write("Scraping links...");
  getData(url).then((dataString) => {
    console.log(dataString)
    links = dataString.match(/https:\/\/courselab([^"]*)/g);
    process.stdout.write("OK!\n");
  });
}

function getData(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let dataString = "";
      res.on("data", (chunk) => {
        dataString += chunk;
      });

      res.on("end", () => {
        resolve(dataString);
      });
    });
  });
}
