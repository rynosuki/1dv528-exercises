exports.scrapeCalendar = (data, url) => processDays(data, url);

const https = require("https");

async function processDays(dataString, url) {
  process.stdout.write("Scraping available days...");
  const links = dataString.match(/<a href="[^\\"]*"/g);
  const daysAvailable = [];
  for (let i = 0; i < links.length; i++) {
    const person = links[i].replace(/<a href=".\//g, "").replace(/"/g, "");
    daysAvailable[i] = await promiseDays(url, person);
  }
  const days = [];
  for (let i = 0; i < daysAvailable[0].length; i++) {
    if (daysAvailable[1].includes(daysAvailable[0][i]) && daysAvailable[2].includes(daysAvailable[0][i])) {
      days.push(daysAvailable[0][i]);
    }
  }
  process.stdout.write("OK!\n");
  return days
}

async function promiseDays(url, person) {
  return processCalendar(url, person).then((availability) => {
    const daysAvailable = [];
    for (let i = 0; i < availability.length; i++) {
      if (availability[i] === "ok") {
        daysAvailable.push(i);
      }
    }
    return daysAvailable;
  });
}

function processCalendar(url, person) {
  return new Promise((resolve) => {
    https.get(url + 'calendar/' + person, (res) => {
      let dataString = "";
      res.on("data", (chunk) => {
        dataString += chunk;
      });

      res.on("end", () => {
        const availability = dataString
          .toLowerCase()
          .match(/<td>[ok-]*<\/td>/g);
        for (let i = 0; i < availability.length; i++) {
          availability[i] = availability[i].replace(/<td>/g, "");
          availability[i] = availability[i].replace(/<\/td>/g, "");
        }
        resolve(availability);
      });
    });
  });
}
