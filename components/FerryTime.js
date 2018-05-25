import React from "react";
import { timeToFerryLeaves } from "../utils/timeUtils";

export default ({ ferry, isNextDay }) => {
  const isSpecialFerry = ferry.includes("*") || ferry.includes("!");
  const formattedFerry = isSpecialFerry ? ferry.replace("*", "") : ferry;
  return (
    <div
      className="row"
      key={ferry}
      style={{ fontSize: 20, fontWeight: 300, marginBottom: 5 }}
    >
      <div className="col-xs-6">
        <span style={{ position: "relative" }}>{formattedFerry}</span>
      </div>
      <div className="col-xs-6">
        {timeToFerryLeaves(ferry, isNextDay ? 1 : 0)}
      </div>
    </div>
  );
};
