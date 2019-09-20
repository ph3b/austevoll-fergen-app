import Reac, { Fragment } from "react";
import { timeToFerryLeaves } from "../utils/timeUtils";
import ContentLoader from "react-content-loader";

export default ({ ferry, isNextDay, isLoading }) => {
  return (
    <div
      style={{ fontSize: 20, fontWeight: 300, marginBottom: isLoading ? 0 : 5 }}
    >
      {isLoading && (
        <ContentLoader
          height={30}
          width={500}
          uniquekey={"asdfe"}
          speed={2}
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
        >
          <circle cx="20" cy={15} r="15" />
          <rect x="45" y={0} rx="0" ry="0" width="440" height="30" />
        </ContentLoader>
      )}
      {!isLoading && (
        <div className="row" key={ferry}>
          <div className="col-xs-6">
            <span style={{ position: "relative" }}>{ferry.time}</span>
          </div>
          <div className="col-xs-4">
            {timeToFerryLeaves(ferry.time, isNextDay ? 1 : 0)}
          </div>

          <div
            className="col-xs-2"
            style={{
              fontWeight: 200,
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            {ferry.route.split(" ")[0]}
          </div>
        </div>
      )}
    </div>
  );
};
