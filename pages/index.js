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
      selectedPort: "krokeide",
      departures: props.departures,
      departuresTomorrow: props.tomorrowDepartures
    };
    this.setPort = this.setPort.bind(this);
  }

  static async getInitialProps(ctx) {
    return await getFerriTimesFor("krokeide", ctx);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedPort !== this.state.selectedPort) {
      const { departures, tomorrowDepartures } = await getFerriTimesFor(
        this.state.selectedPort
      );

      this.setState({ departures, departuresTomorrow: tomorrowDepartures });
    }
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
    const { selectedPort, departures, departuresTomorrow } = this.state;
    const allFerriesForToday = departures.map(d => d.time);
    const ferriesForTomorrow = departuresTomorrow.map(d => d.time);
    const futureFerries = allFerriesForToday.filter(ferryTimeString => {
      const now = new Date();
      const ferryTime = new Date();
      ferryTime.setHours(parseInt(ferryTimeString.split(":")[0]));
      ferryTime.setMinutes(parseInt(ferryTimeString.split(":")[1]));
      ferryTime.setSeconds(0);
      ferryTime.setMilliseconds(0);
      return ferryTime >= now;
    });

    const [nextFerry, ...remainingFerries] = futureFerries;

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

            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}>
                Neste
              </div>
              <FerryTime
                ferry={nextFerry || ferriesForTomorrow[0]}
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
                <FerryList ferries={ferriesForTomorrow} limit={2} isNextDay />
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
