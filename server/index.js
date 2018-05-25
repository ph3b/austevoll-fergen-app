const express = require("express");
const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { getFerryWarnings, getFerryTimesFrom } = require("../utils/ferryCheck");

app.prepare().then(() => {
  const server = express();

  server.get("/status", async (req, res) => {
    const status = await getFerryWarnings();
    if (status === null) {
      return res.send({ anomolies: false });
    } else {
      return res.send({ anomolies: true, status });
    }
  });

  server.get("/times/:port", async (req, res) => {
    const { port } = req.params;
    const { date } = req.query;

    const results = await getFerryTimesFrom(port, date);
    return res.json({ departures: results });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
