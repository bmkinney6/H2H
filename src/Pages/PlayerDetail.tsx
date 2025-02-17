import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios";
import { ACCESS_TOKEN } from "../constants.tsx";

// Define the structure for player stats
type PlayerStats = {
  week: number;
  carries?: number;
  rushing_yards?: number;
  rushing_tds?: number;
  receptions?: number;
  receiving_yards?: number;
  receiving_tds?: number;
  targets?: number;
  fantasy_points: string;
  projected_fantasy_points: string;
  field_goals_made?: number;
  field_goals_attempted?: number;
  field_goal_percentage?: number;
  extra_points?: number;
  completions?: number;
  attempts?: number;
  passing_yards?: number;
  passing_tds?: number;
  interceptions?: number;
  fumbles?: number;
  completion_percentage?: number;
};

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  position: string;
  jersey: number;
  age: number;
  weight: number;
  displayHeight: string;
  player_stats: PlayerStats[];  // Updated this to match the structure
};

export default function PlayerDetail() {
  const { id } = useParams(); // Get player id from URL
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_PLAYER_URL;

  useEffect(() => {
    const fetchPlayerDetail = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        console.error("No token found");
        setError("User is not authenticated.");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlayer(response.data.Player); // Assuming response contains the player object under 'Player'
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;

        if (axiosError.response) {
          console.error("Error response:", axiosError.response.data);
        } else if (axiosError.request) {
          console.error("Error request:", axiosError.request);
        } else {
          console.error("Error message:", axiosError.message);
        }
        setError("Failed to fetch player data.");
      }
    };

    if (id) fetchPlayerDetail();
  }, [id]);

  return (
    <div>
      <h1 className="text-center">Player Details</h1>

      {error && <p>{error}</p>}

      {player && (
        <div className="player-info text-center">
          <h3>{`${player.firstName} ${player.lastName}`}</h3>
          <h5>{`Team: ${player.team}`}</h5>
          <h5>{`Position: ${player.position}`}</h5>
          <p>{`Jersey #: ${player.jersey}`}</p>
          <p>{`Age: ${player.age}`}</p>
          <p>{`Weight: ${player.weight}`}</p>
          <p>{`Height: ${player.displayHeight}`}</p>

          {/* Display Player Stats if available */}
          {player.player_stats.length > 0 ? (
            <div className="player-stats">
              <h4>Player Stats</h4>
              {player.player_stats.map((stat, index) => (
                <div key={index} className="stat-week">
                  <h5>Week: {stat.week}</h5>
                  {/* Display different stats based on player position */}
                  {player.position === 'Running Back' || player.position === 'Wide Receiver' || player.position === 'Tight End' ? (
                    <>
                      <p>Rushing Yards: {stat.rushing_yards}</p>
                      <p>Rushing TDs: {stat.rushing_tds}</p>
                      <p>Receptions: {stat.receptions}</p>
                      <p>Receiving Yards: {stat.receiving_yards}</p>
                      <p>Receiving TDs: {stat.receiving_tds}</p>
                      <p>Targets: {stat.targets}</p>
                    </>
                  ) : null}
                  {player.position === 'Place kicker' ? (
                    <>
                      <p>Field Goals Made: {stat.field_goals_made}</p>
                      <p>Field Goals Attempted: {stat.field_goals_attempted}</p>
                      <p>Field Goal Percentage: {stat.field_goal_percentage}%</p>
                      <p>Extra Points: {stat.extra_points}</p>
                    </>
                  ) : null}
                  {player.position === 'Quarterback' ? (
                    <>
                      <p>Completions: {stat.completions}</p>
                      <p>Passing Yards: {stat.passing_yards}</p>
                      <p>Passing TDs: {stat.passing_tds}</p>
                      <p>Interceptions: {stat.interceptions}</p>
                      <p>Fumbles: {stat.fumbles}</p>
                      <p>Completion Percentage: {stat.completion_percentage}%</p>
                    </>
                  ) : null}
                  <p>Fantasy Points: {stat.fantasy_points}</p>
                  <p>Projected Fantasy Points: {stat.projected_fantasy_points}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No stats available</p>
          )}

          <button onClick={() => navigate("/scout")}>Back to Search</button> {/* Button to go back to the search page */}
        </div>
      )}
    </div>
  );
}
