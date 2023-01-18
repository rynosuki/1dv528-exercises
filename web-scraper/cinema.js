exports.scrapeCinema = (data) => processShowtimes(data);

function processShowtimes(data) {
  process.stdout.write("Scraping showtimes...");
  return new Promise((resolve) => {
    // console.log(data)
  });
  process.stdout.write("OK!\n");
}
