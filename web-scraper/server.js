console.log("Starting web scraper...");
const url = process.title.toString().split(" ")[2];
let links = [];

const https = require("https");

const server = https.createServer().listen(3000);
scrape("links");

function scrape(step) {
  switch (step) {
    case "links":
      process.stdout.write("Scraping links...");
      processLinks(url);
      process.stdout.write("OK!\n");
      console.log(links);
      break;
    case "days":
      process.stdout.write("Scraping available days...");
      processDays(links[0]);
      process.stdout.write("OK!\n");
      break;
    case "showtimes":
      process.stdout.write("Scraping showtimes...");
      processShowtimes(links[1]);
      process.stdout.write("OK!\n");
      break;
    case "reservations":
      process.stdout.write("Scraping possible reservations...");
      processReservations(links[2]);
      process.stdout.write("OK!\n");
      break;
    case "confirmation":
      process.stdout.write("Scraping confirmation...");
      server.close();
      process.stdout.write("OK!\n");
  }
}

function processLinks(url) {
  https.get(url, (res) => {
    let dataString = "";
    res.on("data", (chunk) => {
      dataString += chunk;
    });

    res.on("end", () => {
      links = dataString.match(/https:\/\/courselab([^"]*)/g);
      scrape("days");
    });
  });
}

function processDays(url) {
  https.get(url, (res) => {
    let dataString = "";
    res.on("data", (chunk) => {
      dataString += chunk;
    });

    res.on("end", () => {
      const calendars = dataString.match(/href="([^"]*).html"/g)
      const days = []
      for (let i = 0; i < calendars.length; i++) {
        calendars[i] = calendars[i].replace(/href="./g, "");
        calendars[i] = calendars[i].replace(/"/g, "");
        days[i] = processCalendar(url + calendars[i])
      }
      scrape("showtimes");
    });
  });
}

function processCalendar(url) {
  https.get(url, (res) => {
    let dataString = "";
    res.on("data", (chunk) => {
      dataString += chunk;
    });

    res.on("end", () => {
      const availability = dataString.toLowerCase().match(/<td>[ok-]*<\/td>/g)
      for (let i = 0; i < availability.length; i++) {
        availability[i] = availability[i].replace(/<td>/g, "");
        availability[i] = availability[i].replace(/<\/td>/g, "");
      }
      console.log(availability)
    });
  });
}

function processShowtimes(url) {
  https.get(url, (res) => {
    let dataString = "";
    res.on("data", (chunk) => {
      dataString += chunk;
    });

    res.on("end", () => {
      scrape("reservations");
    });
  });
}

function processReservations(url) {
  https.get(url, (res) => {
    let dataString = "";
    res.on("data", (chunk) => {
      dataString += chunk;
    });

    res.on("end", () => {
      scrape("confirmation");
    });
  });
}
