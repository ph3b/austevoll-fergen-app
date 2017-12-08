const ScrapeIt = require("scrape-it");
const NodeCache = require("node-cache");
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
    cache.set("fosenResponse", null);
    return null;
  }
  cache.set("fosenResponse", result);
  return result;
}

exports.scrapeFosen = scrapeFosen;
