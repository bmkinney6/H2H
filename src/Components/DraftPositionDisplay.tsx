import React from "react";
import "../Styles/draft.css";

type Player = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  headshot: string;
};

type DraftPositionDisplayProps = {
  positions: { [key: string]: Player | null };
};

export default function DraftPositionDisplay({ positions }: DraftPositionDisplayProps) {
    return (
      <div className="draft-position-display">
        <h2>Your Team</h2>
        <div className="positions-container">
          {Object.entries(positions).map(([position, player]) => (
            <div key={position} className="position-slot">
              {player ? (
                <div className="player-card">
                  <img
                    src={player.headshot}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="player-image"
                  />
                  <p className="player-name">{`${player.firstName} ${player.lastName}`}</p>
                  <p className="player-position">{position}</p>
                </div>
              ) : (
                <div className="empty-slot">
                  <p>{position}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }