import React from "react";

const underlineStyle = {
  borderBottom: "5px solid black"
};

export default ({ activePort, setPort }) => (
  <div className="row" style={{ fontSize: 18, fontWeight: "600" }}>
    <div className="col-xs-6">
      <span
        onClick={() => setPort("krokeide")}
        style={activePort === "krokeide" ? underlineStyle : null}
      >
        Krokeide
      </span>
    </div>
    <div className="col-xs-6" onClick={() => setPort("hufthamar")}>
      <span style={activePort === "hufthamar" ? underlineStyle : null}>
        Hufthamar
      </span>
    </div>
  </div>
);
