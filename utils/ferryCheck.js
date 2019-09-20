const ScrapeIt = require("scrape-it");
async function getFerryWarnings() {
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
  return data;
}

async function getFerryTimesFrom(port, date) {
  const HUFTHAMAR_PORT_CODE = "001312449980";
  const KROKEIDE_PORT_CODE = "001312019990";

  let departure = null;
  let destination = null;

  departure = port === "krokeide" ? KROKEIDE_PORT_CODE : HUFTHAMAR_PORT_CODE;
  destination = port === "krokeide" ? HUFTHAMAR_PORT_CODE : KROKEIDE_PORT_CODE;

  const URL = `https://www.fjord1.no/Ruteoversikt/Hordaland/Hufthamar-Krokeide?from=${departure}&to=${destination}&date=${date}`;

  const { data } = await ScrapeIt(URL, {
    departures: {
      listItem: ".component-list__items__departure-item",
      data: {
        route: {
          selector: ".f1-alert"
        },
        time: {
          selector: ".stop-content > time",
          convert: raw => raw.split("\n")[0]
        }
      }
    }
  });

  return data.departures;
}

exports.getFerryWarnings = getFerryWarnings;
exports.getFerryTimesFrom = getFerryTimesFrom;
