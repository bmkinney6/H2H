import { useEffect, useState } from "react";
import "../Styles/draft.css";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

type Player = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  headshot: string;
};

type DraftPositionDisplayProps = {
  leagueId: string;
  teamPositions: { [key: string]: Player | null }; 
};

const defaultPositions = [
  { key: "QB", name: "Quarterback" },
  { key: "RB1", name: "Running Back 1" },
  { key: "RB2", name: "Running Back 2" },
  { key: "WR1", name: "Wide Receiver 1" },
  { key: "WR2", name: "Wide Receiver 2" },
  { key: "TE", name: "Tight End" },
  { key: "FLX", name: "Flex" },
  { key: "K", name: "Kicker" },
  { key: "DEF", name: "Defense" },
  { key: "BN1", name: "Bench 1" },
  { key: "BN2", name: "Bench 2" },
  { key: "BN3", name: "Bench 3" },
  { key: "BN4", name: "Bench 4" },
  { key: "BN5", name: "Bench 5" },
  { key: "BN6", name: "Bench 6" },
];

export default function DraftPositionDisplay({ leagueId, teamPositions }: DraftPositionDisplayProps) {
  const [positions, setPositions] = useState<{ [key: string]: Player | null }>({});
  const [unfilledPositions, setUnfilledPositions] = useState(defaultPositions);

  useEffect(() => {
    
    setPositions(teamPositions);

    const filledPositions = Object.keys(teamPositions).filter((key) => teamPositions[key] !== null && teamPositions[key] !== undefined);
    setUnfilledPositions(
      defaultPositions.filter((pos) => !filledPositions.includes(pos.key))
    );
  }, [teamPositions]); 

  useEffect(() => {
    const fetchTeamPositions = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/league/${leagueId}/team-positions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teamPositions = response.data.positions;

        const filledPositions = Object.keys(teamPositions).filter((key) => teamPositions[key]);
        setPositions(teamPositions);
        setUnfilledPositions(
          defaultPositions.filter((pos) => !filledPositions.includes(pos.key))
        );
      } catch (error) {
        console.error("Error fetching team positions:", error);
      }
    };

    fetchTeamPositions();
  }, [leagueId]);

  return (
    <div className="draft-position-display">
      <div className="unfilled-positions">
        <h3>Unfilled Positions</h3>
        <ul>
          {unfilledPositions.map(({ key, name }) => (
            <li key={key}>{name}</li>
          ))}
        </ul>
      </div>

      <div className="picked-players">
        <h3>Your Team</h3>
        <ul className="positions-container">
          {defaultPositions
            .filter(({ key }) => positions[key]) 
            .map(({ key, name }) => (
              <li key={key} className="player-card-container">
                <div className="player-card">
                  <img
                    src={positions[key]?.headshot || "/placeholder.png"}
                    alt={`${positions[key]?.firstName} ${positions[key]?.lastName}`}
                    className="player-image"
                  />
                  <p className="player-name">{`${positions[key]?.firstName} ${positions[key]?.lastName}`}</p>
                  <p className="player-position">{name}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}