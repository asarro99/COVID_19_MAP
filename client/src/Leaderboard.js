import React from "react";

function Leaderboard(props) {
  const cPoints = props.cPoints;

  const leaderBoard = cPoints =>
    cPoints.slice(0, 10).map(cPoint => {
      return (
        <div>
          <h2>{cPoint.state}</h2>
          <h3>{cPoint.cases.slice(-1)[0].n}</h3>
        </div>
      );
    });
  return leaderBoard;
}

export default props => (
  <div>
    <Leaderboard style={{ zIndex: 1 }} {...props} />
  </div>
);
