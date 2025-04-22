import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";




const BettingPage = () => {
  const { leagueId, matchupId } = useParams();
  const [weeklyPosition, setWeeklyPosition] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMatchupAndTeam = async () => {
      try {
        console.log("Fetching matchup and team details...");
        const response = await axios.get(`/api/league/${leagueId}/matchup/${matchupId}/details/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("API Response:", response.data); // Log the response
        setWeeklyPosition(response.data.weekly_position || "N/A");
        setPlayers(response.data.players || []); // Ensure players is always an array
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching matchup and team:", err);
        setError(err.response?.data?.error || "Failed to load matchup details.");
        setLoading(false);
        if (error) {
          return <p className="error-message">{error}</p>;
        }
        
        if (!weeklyPosition) {
          return <p>No weekly matchup position available.</p>;
        }
        
        if (!players.length) {
          return <p>No players available for betting.</p>;
        }
      }
    };
  
    fetchMatchupAndTeam();
  }, [leagueId, matchupId]);

  const handlePlaceBet = async () => {
    if (!selectedPlayer || !betAmount) {
      setError("Please select a player and enter a bet amount.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/league/${leagueId}/matchup/${matchupId}/place-bet/`,
        {
          player_id: selectedPlayer.id,
          amount: betAmount,
          position: selectedPlayer.position,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setSuccess(response.data.success);
      setError("");
      setBetAmount("");
      setSelectedPlayer(null);
    } catch (err) {
      console.error("Error placing bet:", err);
      setError(err.response?.data?.error || "Failed to place bet.");
      setSuccess("");
    }
  };

  return (
    <div className="betting-page">
      <h1>Betting Page</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="matchup-details">
        <h2>Weekly Matchup Position</h2>
        <p>{weeklyPosition}</p>
      </div>

      <div className="available-players">
        <h2>Your Players</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name} ({player.position})
              <button onClick={() => setSelectedPlayer(player)}>Select</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="place-bet">
        <h2>Place a Bet</h2>
        <div>
          <label>
            Selected Player: <strong>{selectedPlayer?.name || "None"}</strong>
          </label>
        </div>
        <div>
          <label>
            Bet Amount:
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handlePlaceBet}>Place Bet</button>
      </div>
    </div>
  );
};

export default BettingPage;