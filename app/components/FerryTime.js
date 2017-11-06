import React from "react";
import { timeToFerryLeaves } from "../utils/timeUtils";

export default ({ ferry }) => {
  const isSpecialFerry = ferry.includes("*");
  const formattedFerry = isSpecialFerry ? ferry.replace("*", "") : ferry;
  return (
    <div
      className="row"
      key={ferry}
      style={{ fontSize: 20, fontWeight: 300, marginBottom: 5 }}
    >
      <div className="col-xs-6">
        <span style={{ position: "relative" }}>
          {formattedFerry}
          {isSpecialFerry && (
            <div
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: "black",
                position: "absolute",
                top: 3,
                right: -10
              }}
            />
          )}
        </span>
      </div>
      <div className="col-xs-6">{timeToFerryLeaves(ferry)}</div>
    </div>
  );
};
