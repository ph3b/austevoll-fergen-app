import React, { Fragment } from "react";
import FerryList from "../components/FerryList";
import Layout from "../components/Layout";
import Header from "../components/Header";
import PortMenu from "../components/PortMenu";
import FerryTime from "../components/FerryTime";
import WarningLabel from "../components/WarningLabel";
import axios from "axios";
import { withRouter } from "next/router";
import { format, parse } from "date-fns";
import nb from "date-fns/locale/nb";
import { zonedTimeToUtc } from "date-fns-tz";

const dateToString = date => {
  return format(date, "dd.MM.yyyy", { locale: nb });
};

const getFerryTimesFor = async port => {
  const FERRY_TIME_URL = `/api/times/${port}`;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayPromise = axios.get(
    `${FERRY_TIME_URL}?date=${dateToString(today)}`
  );
  const tomorrowPromise = axios.get(
    `${FERRY_TIME_URL}?date=${dateToString(tomorrow)}`
  );

  const [todayData, tomorrowData] = await Promise.all([
    todayPromise,
    tomorrowPromise
  ]);

  return {
    departures: todayData.data.departures,
    tomorrowDepartures: tomorrowData.data.departures
  };
};

class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      warning: null,
      hufthamarFerries: {
        tomorrowDepartures: [],
        departures: []
      },
      krokeideFerries: { tomorrowDepartures: [], departures: [] }
    };
  }

  static getInitialProps(req) {
    return {
      selectedPort: req.query.port
    };
  }

  async componentDidMount() {
    const warningPromise = axios.get("/api/status");

    const [krokeideFerries, hufthamarFerries, warningData] = await Promise.all([
      getFerryTimesFor("krokeide"),
      getFerryTimesFor("hufthamar"),
      warningPromise
    ]);

    this.setState({
      krokeideFerries,
      hufthamarFerries,
      warning: warningData.data,
      isLoading: false
    });

    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 10);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setPort(selectedPort) {
    this.setState({ selectedPort });
  }

  render() {
    const { router } = this.props;

    const {
      hufthamarFerries,
      krokeideFerries,
      warning,
      isLoading
    } = this.state;

    const selectedPort = this.props.selectedPort || "krokeide";

    const departures =
      selectedPort === "krokeide"
        ? krokeideFerries.departures
        : hufthamarFerries.departures;

    const departuresTomorrow =
      selectedPort === "krokeide"
        ? krokeideFerries.tomorrowDepartures
        : hufthamarFerries.tomorrowDepartures;

    const allFerriesForToday = departures;
    const ferriesForTomorrow = departuresTomorrow;

    const futureFerries = allFerriesForToday.filter(({ time }) => {
      const now = zonedTimeToUtc(new Date(), "Europe/Oslo");
      const ferryTime = parse(time, "HH:mm", new Date(), {
        locale: nb
      });

      return ferryTime >= now;
    });

    const [nextFerry, ...remainingFerries] = futureFerries;

    const [
      firstFerryForTomorrow,
      ...remainingFerriesForTomorrow
    ] = ferriesForTomorrow;

    return (
      <Layout>
        <Header />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="container-fluid"
            style={{ marginTop: 20, width: "100%", maxWidth: "320px" }}
          >
            <PortMenu
              setPort={port => {
                this.props.router.push(`/?port=${port}`, `/${port}`);
              }}
              activePort={selectedPort}
            />

            <div style={{ marginTop: 40 }}>
              {warning && <WarningLabel warning={warning} />}
            </div>

            {true && (
              <div>
                <div style={{ marginTop: 20 }}>
                  <div
                    style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}
                  >
                    Neste ferge
                  </div>
                  <FerryTime
                    isLoading={isLoading}
                    ferry={nextFerry || firstFerryForTomorrow}
                    isNextDay={!nextFerry}
                  />
                </div>

                <div
                  style={{
                    borderBottom: "1px solid #DBDBDB",
                    marginTop: 10,
                    marginBottom: 10
                  }}
                />

                <FerryList isLoading={isLoading} ferries={remainingFerries} />

                {new Date().getHours() >= 18 && (
                  <div style={{ marginTop: 20 }}>
                    <div
                      style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}
                    >
                      I morgen
                    </div>
                    <FerryList
                      isLoading={isLoading}
                      ferries={remainingFerriesForTomorrow}
                      limit={2}
                      isNextDay
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default withRouter(Index);
