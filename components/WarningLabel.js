import React from "react";
import axios from "axios";
const port = parseInt(process.env.PORT, 10) || 3000;

class WarningLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anomolies: false,
      events: []
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
      this.setState({ anomolies: true, events: data.status.events });
    }
    // this.setState(data.anomolies);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { anomolies, events } = this.state;
    if (!anomolies) return null;

    return (
      <div>
        {events.map(event => (
          <div
            key={event.created}
            style={{
              backgroundColor: "#FFE89D",
              padding: 15,
              position: "relative",
              marginBottom: 10
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 300 }}>
              {event.message
                .split(":")
                .filter((_, i) => i > 0)
                .join(":")}
            </div>
            <div style={{ marginTop: 15, fontSize: 12, fontWeight: 500 }}>
              {event.created}
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
        ))}
      </div>
    );
  }
}

export default WarningLabel;
