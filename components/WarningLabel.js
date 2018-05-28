import React from "react";
import axios from "axios";
const port = parseInt(process.env.PORT, 10) || 3000;

class WarningLabel extends React.Component {
  render() {
    const {
      warning: { anomolies, status }
    } = this.props;
    if (!anomolies || status.events.length === 0) return null;

    return (
      <div>
        <div style={{ fontSize: 25, fontWeight: 500, marginBottom: 5 }}>
          Varsler
        </div>
        {status.events.map(event => (
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
