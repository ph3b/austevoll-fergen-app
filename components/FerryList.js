import React, { Fragment } from "react";
import FerryTime from "./FerryTime";
import ContentLoader from "react-content-loader";

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
    const { ferries, isNextDay, limit, style, isLoading } = this.props;
    const { showAll } = this.state;
    let maxIndexToInclude = ferries.length;

    if (showAll && limit !== undefined) {
      maxIndexToInclude = ferries.length;
    } else if (limit !== undefined) {
      maxIndexToInclude = limit;
    }
    return (
      <div style={style}>
        {isLoading && (
          <div>
            <ContentLoader
              height={600}
              width={500}
              uniquekey={"kjhdfkjg"}
              speed={2}
              primaryColor="#f3f3f3"
              secondaryColor="#ecebeb"
            >
              {Array(15)
                .fill(null)
                .map((_, index) => {
                  return (
                    <Fragment key={index}>
                      <circle cx="20" cy={index * 60 + 20} r="15" />
                      <rect
                        x="45"
                        y={index * 60 + 5}
                        rx="5"
                        ry="5"
                        width="440"
                        height="30"
                      />
                    </Fragment>
                  );
                })}
            </ContentLoader>
          </div>
        )}

        {!isLoading && (
          <div>
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
                style={{
                  justifyContent: "center",
                  display: "flex",
                  marginTop: 15
                }}
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
        )}
      </div>
    );
  }
}

export default FerryList;
