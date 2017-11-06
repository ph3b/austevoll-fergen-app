import React from "react";
import getsy from "getsy";

import FerryTimes from "../ferrytimes.json";
import Layout from "../components/Layout";
import Header from "../components/Header";
import PortMenu from "../components/PortMenu";
import FerryTime from "../components/FerryTime";
import WarningLabel from "../components/WarningLabel";
import { getFutureFerries } from "../utils/timeUtils";

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

    return (
      <Layout>
        <Header />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="container-fluid" style={{ marginTop: 20 }}>
            <PortMenu setPort={this.setPort} activePort={selectedPort} />

            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}>
                Neste
              </div>
              <FerryTime ferry={nextFerry} />
            </div>

            <div
              style={{
                borderBottom: "1px solid #DBDBDB",
                marginTop: 10,
                marginBottom: 10
              }}
            />

            <div>
              {remainingFerries.map(ferry => (
                <div style={{ marginBottom: 5 }}>
                  <FerryTime ferry={ferry} key={ferry} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <WarningLabel />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
