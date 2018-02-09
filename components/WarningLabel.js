import React from "react";
import axios from "axios";
const port = parseInt(process.env.PORT, 10) || 3000;

class WarningLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anomolies: false,
      status: null
    };
  }

  componentDidMount() {
    this.getAnomolies();
    this.interval = setInterval(() => {
      this.getAnomolies();
    }, 1000 * 30);
  }

  async getAnomolies() {
    const { data } = await axios.get("/status");
    if (data.anomolies) {
      this.setState(data.anomolies);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { anomolies, status } = this.state;
    if (!anomolies) return null;

    return (
      <div
        style={{
          backgroundColor: "#FFE89D",
          padding: 15,
          position: "relative"
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 300 }}>
          {status.description}
        </div>
        <div style={{ marginTop: 15, fontSize: 14, fontWeight: 500 }}>
          Publisert {status.date}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 8,
            fontSize: 30,
            opacity: 0.5
          }}
        >
          !
        </div>
      </div>
    );
  }
}

export default WarningLabel;
