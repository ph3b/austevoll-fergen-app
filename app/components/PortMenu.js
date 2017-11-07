import React from "react";

const underlineStyle = {
  borderBottom: "5px solid black"
};

const defaultStyle = {
  cursor: "default"
};

export default ({ activePort, setPort }) => (
  <div className="row" style={{ fontSize: 25, fontWeight: "600" }}>
    <div className="col-xs-6">
      <span
        onClick={() => setPort("krokeide")}
        style={
          activePort === "krokeide"
            ? { ...underlineStyle, ...defaultStyle }
            : defaultStyle
        }
      >
        Krokeide
      </span>
    </div>
    <div className="col-xs-6" onClick={() => setPort("hufthamar")}>
      <span
        style={
          activePort === "hufthamar"
            ? { ...underlineStyle, ...defaultStyle }
            : defaultStyle
        }
      >
        Hufthamar
      </span>
    </div>
  </div>
);
