import React from "react";
import FerryTime from "./FerryTime";

class FerryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const { ferries, isNextDay, limit, style } = this.props;
    const { showAll } = this.state;
    let maxIndexToInclude = ferries.length;

    if (showAll && limit !== undefined) {
      maxIndexToInclude = ferries.length;
    } else if (limit !== undefined) {
      maxIndexToInclude = limit;
    }
    return (
      <div style={style}>
        {ferries
          .filter((_, i) => i <= maxIndexToInclude)
          .map(ferry => (
            <FerryTime
              key={ferry + isNextDay}
              ferry={ferry}
              isNextDay={isNextDay}
            />
          ))}
        {limit !== undefined && (
          <div
            onClick={this.toggleShowAll}
            style={{ justifyContent: "center", display: "flex", marginTop: 15 }}
          >
            <button
              style={{
                border: "none",
                padding: "7px 10px 7px 10px",
                backgroundColor: "light-gray",
                fontSize: 12,
                borderRadius: "3px"
              }}
            >
              {showAll ? "Skjul" : "Vis alle"}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default FerryList;
