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

const server = https.createServer().listen(3000);
scrape()

async function scrape() {
  await processLinks(url);
  daysAvailable = await scrapeDays.scrapeCalendar(await getData(links[0]), url);
  console.log(daysAvailable)
  showTimes = await scrapeShowtimes.scrapeCinema(await getData(links[1]), daysAvailable);
  openReservations = await scrapeReservations.scrapeRestaurant(url);
  console.log(
    confirmation.confirmation(daysAvailable, showTimes, openReservations)
  );
}

async function processLinks(url) {
  process.stdout.write("Scraping links...");
  await getData(url).then((dataString) => {
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
