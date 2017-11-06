import React from "react";
import fetch from "node-fetch";

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
    const result = await fetch("https://austevoll-api.now.sh/status", {
      method: "GET"
    });

    const json = await result.json();

    if (json.anomolies) {
      this.setState(json);
    }
  }

  render() {
    const { anomolies, status } = this.state;
    if (!anomolies) return <div style={{ minWidth: 256 }} />;

    return (
      <div
        style={{
          backgroundColor: "#FFE89D",
          padding: 15
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 300
          }}
        >
          {status.description}
        </div>
        <div style={{ marginTop: 15, fontSize: 14, fontWeight: 500 }}>
          Publisert {status.date}
        </div>
      </div>
    );
  }
}

export default WarningLabel;
