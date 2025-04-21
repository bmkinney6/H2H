import React, { useEffect, useRef } from "react";
import "../Styles/draft.css";

type DraftPick = {
  user_id: number;
  player_name: string;
  position: string;
};

type DraftLogProps = {
  draftPicks: DraftPick[];
  userIdToUsername: { [key: number]: string }; // Map of user IDs to usernames
};

export default function DraftLog({ draftPicks, userIdToUsername }: DraftLogProps) {
    const logRef = useRef<HTMLDivElement>(null);
  
    // Auto-scroll to the bottom when new picks are added
    useEffect(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, [draftPicks]);
  
    return (
      <div className="draft-log" ref={logRef}>
        <div className="draft-log-header">
          <h2>Draft Picks</h2>
        </div>
        <div className="draft-log-grid">
          {draftPicks.map((pick, index) => (
            <div key={index} className="draft-log-item">
              <strong>
                {userIdToUsername?.[pick.user_id] || `User ${pick.user_id}`}
              </strong>{" "}
              picked <strong>{pick.player_name}</strong> for position{" "}
              <strong>{pick.position}</strong>.
            </div>
          ))}
        </div>
      </div>
    );
  }