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
      backgroundColor: "#DE6CFF",
      flexDirection: "column"
    }}
  >
    <div style={{ fontSize: 25, fontWeight: 200 }}>Austevoll</div>
    <div style={{ fontSize: 18, fontWeight: 200 }}>{getTodayString()}</div>
  </div>
);