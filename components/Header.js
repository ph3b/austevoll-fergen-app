import React from "react";
import { getTodayString } from "../utils/timeUtils";

export default () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 90,
      color: "white",
      backgroundColor: "#2349E1",
      flexDirection: "column"
    }}
  >
    <div style={{ fontSize: 25, fontWeight: 600 }}>Austevollfergen</div>
    <div style={{ fontSize: 18, fontWeight: 200 }}>{getTodayString()}</div>
  </div>
);
