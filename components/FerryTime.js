import Reac, { Fragment } from "react";
import { timeToFerryLeaves } from "../utils/timeUtils";
import ContentLoader from "react-content-loader";

export default ({ ferry, isNextDay, isLoading }) => {
  const isSpecialFerry = ferry
    ? ferry.includes("*") || ferry.includes("!")
    : false;
  const formattedFerry =
    ferry && isSpecialFerry ? ferry.replace("*", "") : ferry;

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
            <span style={{ position: "relative" }}>{formattedFerry}</span>
          </div>
          <div className="col-xs-6">
            {timeToFerryLeaves(ferry, isNextDay ? 1 : 0)}
          </div>
        </div>
      )}
    </div>
  );
};
