import React from "react";
import getsy from "getsy";

import FerryTimes from "../ferrytimes.json";
import FerryList from "../components/FerryList";
import Layout from "../components/Layout";
import Header from "../components/Header";
import PortMenu from "../components/PortMenu";
import FerryTime from "../components/FerryTime";
import WarningLabel from "../components/WarningLabel";
import { getFutureFerries, getFerriesForTomorrow } from "../utils/timeUtils";

class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedPort: "krokeide"
    };
    this.setPort = this.setPort.bind(this);
  }

  componentDidMount() {
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
    const { selectedPort } = this.state;
    const ferryTimesForSelectedPort = FerryTimes[`from_${selectedPort}`];
    const [nextFerry, ...remainingFerries] = getFutureFerries(
      ferryTimesForSelectedPort
    );
    const ferriesForTomorrow = getFerriesForTomorrow(ferryTimesForSelectedPort);
    return (
      <Layout>
        <Header />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="container-fluid"
            style={{ marginTop: 20, width: "100%", maxWidth: "320px" }}
          >
            <PortMenu setPort={this.setPort} activePort={selectedPort} />

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

            <div style={{ marginTop: 40 }}>
              <WarningLabel />
            </div>

            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  backgroundColor: "black",
                  display: "inline-block"
                }}
              />
              <span style={{ marginLeft: 3, fontSize: 12, fontWeight: 500 }}>
                ferge 2
              </span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
