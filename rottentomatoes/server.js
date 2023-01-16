/* Server.js - This file is the initial starting point for the Node/Express server. */
/* NASA API key: 221UQsxzFp5C79Kn8kWSsyEWVY8E6fGOj9nZnrMG */
const http = require("http");
const port = 3000;
const hostname = "127.0.0.1";

const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
      handleGetRequest(req.url, res);
    } else if (req.method === "POST") {
      handlePostRequest(req, res);
    }
  })

server.listen(port, hostname);

function handleGetRequest(url, res) {
  let page;
  try {
    switch (url) {
      case "/":
        page = require("./pages/index");
        break;
      default:
        if (fs.existsSync(`./pages${url.split(".html")[0]}`)) {
          page = require(`./pages${url.split(".html")[0]}/index`);
        }
        break;
    }
    res.setHeader("Content-Type", "text/html");
    res.end(page.render);
    console.log('Posted page: ' + url)
  } catch (error) {
    res.statusCode = 404;
    console.log(error)
    res.end();
  }
}

function handlePostRequest(req, res) {
  let body = [];
  req.on("error", (err) => {
    console.error(err);
  }).on("data", (chunk) => {
    body.push(chunk);
  }).on("end", () => {
    body = Buffer.concat(body).toString();
    const page = require(`./pages${req.url.split(".html")[0]}/index`);
    page.processPOST(body, res)
  })
}