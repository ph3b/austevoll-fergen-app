import React from "react";
import FerryList from "../components/FerryList";
import Layout from "../components/Layout";
import Header from "../components/Header";
import PortMenu from "../components/PortMenu";
import FerryTime from "../components/FerryTime";
import WarningLabel from "../components/WarningLabel";
import axios from "axios";

const dateToString = date => {
  return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }.${date.getFullYear()}`;
};

const getFerriTimesFor = async (port, ctx = {}) => {
  const URL = ctx.req
    ? `http://${ctx.req.headers.host}/times/${port}`
    : `/times/${port}`;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayPromise = axios.get(`${URL}?date=${dateToString(today)}`);
  const tomorrowPromise = axios.get(`${URL}?date=${dateToString(tomorrow)}`);

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
      selectedPort: "krokeide"
    };
    this.setPort = this.setPort.bind(this);
  }

  static async getInitialProps(ctx) {
    const [krokeideFerries, hufthamarFerries] = await Promise.all([
      getFerriTimesFor("krokeide", ctx),
      getFerriTimesFor("hufthamar", ctx)
    ]);
    return { krokeideFerries, hufthamarFerries };
  }

  async componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 30);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setPort(selectedPort) {
    this.setState({ selectedPort });
  }

  render() {
    const { selectedPort } = this.state;

    const { hufthamarFerries, krokeideFerries } = this.props;
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
            <PortMenu setPort={this.setPort} activePort={selectedPort} />

            <div style={{ marginTop: 40 }}>
              <WarningLabel />
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

export default Index;
