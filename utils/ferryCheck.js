const ScrapeIt = require("scrape-it");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 2, checkperiod: 10 });
const ferryTimeCache = new NodeCache({ stdTTL: 60 * 2 });

async function getFerryWarnings() {
  if (cache.get("ferryWarning") !== undefined) {
    console.log("Ferry warning hit");
    return cache.get("ferryWarning");
  }

  console.log("Ferry warning miss");
  const result = await ScrapeIt(
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

  const { events } = result;
  if (events.length === 0) {
    cache.set("ferryWarning", null);
    return null;
  }
  cache.set("ferryWarning", result);
  return result;
}

async function getFerryTimesFrom(port, date) {
  const HUFTHAMAR_PORT_CODE = "001312449980";
  const KROKEIDE_PORT_CODE = "001312019990";

  let departure = null;
  let destination = null;

  const cacheKey = `${port}-${date}`;

  if (ferryTimeCache.get(cacheKey) !== undefined) {
    console.log("Ferrytime hit");
    return ferryTimeCache.get(cacheKey);
  }

  if (port === "krokeide") {
    departure = KROKEIDE_PORT_CODE;
    destination = HUFTHAMAR_PORT_CODE;
  } else {
    departure = HUFTHAMAR_PORT_CODE;
    destination = KROKEIDE_PORT_CODE;
  }

  const URL = `https://www.fjord1.no/Ruteoversikt/Hordaland/Hufthamar-Krokeide?from=${departure}&to=${destination}&date=${date}`;

  const result = await ScrapeIt(URL, {
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
  console.log("Ferrytime miss");
  ferryTimeCache.set(cacheKey, result.departures);
  return result.departures;
}

exports.getFerryWarnings = getFerryWarnings;
exports.getFerryTimesFrom = getFerryTimesFrom;
