import React from "react";

export const Leaderboard = ({ winners }) => {
  return (
    <div className="winners">
      <div className="winners-title">Leader Board</div>
      <div className="winners-content">
        {winners.map(winner => (
          <div className="winners-item winner" key={winner.id}>
            <div className="winner-name">{winner.winner}</div>
            <div className="winner-date">{winner.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
