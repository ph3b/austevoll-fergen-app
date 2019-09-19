import React from "react";
import FerryList from "../components/FerryList";
import Layout from "../components/Layout";
import Header from "../components/Header";
import PortMenu from "../components/PortMenu";
import FerryTime from "../components/FerryTime";
import WarningLabel from "../components/WarningLabel";
import axios from "axios";
import { withRouter } from "next/router";
import { format } from "date-fns";
import nb from "date-fns/locale/nb";

const dateToString = date => {
  return format(date, "dd.mm.yyyy", { locale: nb });
};

const getFerryTimesFor = async (port, ctx = {}) => {
  const FERRY_TIME_URL = ctx.req
    ? `http://${ctx.req.headers.host}/api/times/${port}`
    : `/api/times/${port}`;

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
  static async getInitialProps(ctx) {
    const WARNING_URL = ctx.req
      ? `http://${ctx.req.headers.host}/api/status`
      : "/api/status";

    const warningPromise = axios.get(WARNING_URL);

    const [krokeideFerries, hufthamarFerries, warningData] = await Promise.all([
      getFerryTimesFor("krokeide", ctx),
      getFerryTimesFor("hufthamar", ctx),
      warningPromise
    ]);

    return { krokeideFerries, hufthamarFerries, warning: warningData.data };
  }

  async componentDidMount() {
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
    const { hufthamarFerries, krokeideFerries, warning, router } = this.props;

    const selectedPort =
      !router.query.port || router.query.port === "krokeide"
        ? "krokeide"
        : "hufthamar";

    const departures =
      selectedPort === "krokeide"
        ? krokeideFerries.departures
        : hufthamarFerries.departures;

    const departuresTomorrow =
      selectedPort === "krokeide"
        ? krokeideFerries.tomorrowDepartures
        : hufthamarFerries.tomorrowDepartures;

    const allFerriesForToday = departures.map(d => d.time);
    const ferriesForTomorrow = departuresTomorrow.map(d => d.time);

    const futureFerries = allFerriesForToday.filter(ferryTimeString => {
      const now = new Date();
      const ferryTime = new Date();
      const [ferryHour, ferryMinutes] = ferryTimeString.split(":");
      ferryTime.setHours(parseInt(ferryHour));
      ferryTime.setMinutes(parseInt(ferryMinutes));
      ferryTime.setSeconds(0);
      ferryTime.setMilliseconds(0);
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
              <WarningLabel warning={warning} />
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}>
                Neste ferge
              </div>
              <FerryTime
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

            <FerryList ferries={remainingFerries} />

            {new Date().getHours() >= 18 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}>
                  I morgen
                </div>
                <FerryList
                  ferries={remainingFerriesForTomorrow}
                  limit={2}
                  isNextDay
                />
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default withRouter(Index);
