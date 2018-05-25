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
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { anomolies, events } = this.state;
    if (!anomolies || events.length === 0) return null;

    return (
      <div>
        <div style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}>
          Varsler
        </div>
        {events.map(event => (
          <div
            key={event.created}
            style={{
              backgroundColor: "#FFE89D",
              padding: 10,
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
            <div style={{ marginTop: 5, fontSize: 12, fontWeight: 500 }}>
              {event.created}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default WarningLabel;
