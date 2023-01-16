exports.render = renderPage();
exports.processPOST = (body, res) => requestPOST(body, res);

async function requestPOST(body, res) {
  const techport = body.split("=")[1];
  await fetch(
    `https://api.nasa.gov/techport/api/projects/${techport}?api_key=DEMO_KEY`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.setHeader("Content-Type", "text/html");
      res.end(
        `<div>
          <h1>${data.project.title}</h1>
          <p>${data.project.description}</p>
          <p>Started:${data.project.startYear}</p>
          <p>Ended:${data.project.endYear}</p>
          <p>Status:${data.project.statusDescription}</p>
          `
      );
    });
}

function renderPage() {
  return `<div>
      <form method="POST">
        <input type="text" placeholder="Techport (number)" name="techport"/>
        <button>Submit</button>
      </form>
    </div>`;
}
