const ScrapeIt = require("scrape-it");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 2, checkperiod: 10 });
const ferryTimeCache = new NodeCache({ stdTTL: 60 * 2 });

async function getFerryWarnings() {
  if (cache.get("ferryWarning") !== undefined) {
    return cache.get("ferryWarning");
  }

  const { data } = await ScrapeIt(
    "https://www.fjord1.no/Ruteoversikt/Hordaland/Hufthamar-Krokeide",
    {
      events: {
        listItem: ".traffic-message",
        data: {
          created: {
            selector: ".date"
          },
          message: {
            selector: ".content .ezstring-field"
          }
        }
      }
    }
  );

  const { events } = data;
  if (events.length === 0) {
    cache.set("ferryWarning", null);
    return null;
  }
  cache.set("ferryWarning", data);
  return data;
}

async function getFerryTimesFrom(port, date) {
  const HUFTHAMAR_PORT_CODE = "001312449980";
  const KROKEIDE_PORT_CODE = "001312019990";

  let departure = null;
  let destination = null;

  const cacheKey = `${port}-${date}`;

  if (ferryTimeCache.get(cacheKey) !== undefined) {
    return ferryTimeCache.get(cacheKey);
  }

  departure = port === "krokeide" ? KROKEIDE_PORT_CODE : HUFTHAMAR_PORT_CODE;
  destination = port === "krokeide" ? HUFTHAMAR_PORT_CODE : KROKEIDE_PORT_CODE;

  const URL = `https://www.fjord1.no/Ruteoversikt/Hordaland/Hufthamar-Krokeide?from=${departure}&to=${destination}&date=${date}`;

  const { data } = await ScrapeIt(URL, {
    departures: {
      listItem: ".component-list__items__departure-item",
      data: {
        time: {
          selector: ".stop-content > time",
          convert: raw => raw.split("\n")[0]
        }
      }
    }
  });
  ferryTimeCache.set(cacheKey, data.departures);
  return data.departures;
}

exports.getFerryWarnings = getFerryWarnings;
exports.getFerryTimesFrom = getFerryTimesFrom;
