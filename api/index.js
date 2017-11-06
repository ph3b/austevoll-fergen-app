const ScrapeIt = require("scrape-it");
const app = require("express")();
const NodeCache = require("node-cache");
const PORT = process.env.PORT || 8080;
const cors = require("cors");

app.use(cors());

// Make a cache with 2 minutes TTL. Check every 20 seconds.
const cache = new NodeCache({ stdTTL: 60 * 2, checkperiod: 10 });

async function scrapeFosen() {
  if (cache.get("fosenResponse") !== undefined) {
    console.log("Value in cache :D ");
    return cache.get("fosenResponse");
  }
  console.log("Value not in cache :( ");
  const result = await ScrapeIt(
    "http://www.fosennamsos.no/hufthamar-krokeide/",
    {
      description: ".service.active .digest",
      date: ".service.active .date"
    }
  );

  const { description, date } = result;
  if (!description && !date) {
    return null;
  }
  return result;
}

app.get("/status", async (req, res) => {
  const status = await scrapeFosen();
  cache.set("fosenResponse", status);
  if (status === null) {
    return res.send({ anomolies: false });
  } else {
    return res.send({ anomolies: true, status });
  }
});

app.listen(PORT, () => console.log("Listening on port: " + PORT));
