import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Styles/Betting.css";
import { ACCESS_TOKEN } from "../constants";

const API_URL1 = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const positionMap: Record<string, string> = {
  QB: "Quarterback",
  RB1: "Running Back",
  RB2: "Running Back",
  WR1: "Wide Receiver",
  WR2: "Wide Receiver",
  TE: "Tight End",
  FLX: "Flex",
  K: "Kicker",
  DEF: "Defense",
};

const BettingPage = () => {
  const { leagueId, matchupId } = useParams();
  const [weeklyPosition, setWeeklyPosition] = useState("");
  const [players, setPlayers] = useState([]);
  const [opponentPlayers, setOpponentPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [existingBet, setExistingBet] = useState(null);
  const [opponentBet, setOpponentBet] = useState(null);
  const [userBalance, setUserBalance] = useState(100); // Example balance

  useEffect(() => {
    if (!matchupId) {
      setError("Matchup ID is missing. Please try again.");
      return;
    }

    const fetchMatchupAndTeam = async () => {
      try {
        // Fetch matchup details
        const response = await axios.get(
          `${API_URL1}/api/league/${leagueId}/matchup/${matchupId}/details/`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
          }
        );
        setWeeklyPosition(response.data.weekly_position || "N/A");
        setPlayers(response.data.players || []);

        // Fetch opponent players
        const opponentResponse = await axios.get(
          `${API_URL1}/api/matchup/${matchupId}/available-players/`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
          }
        );
        setOpponentPlayers(opponentResponse.data.opponent_players || []);

        // Fetch bets for the matchup
        const betResponse = await axios.get(
          `${API_URL1}/api/matchup/${matchupId}/bets/`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
          }
        );

        // Check for user's and opponent's bets
        const userBet = betResponse.data.find(
          (bet) => bet.team.author === localStorage.getItem("userId")
        );
        const oppBet = betResponse.data.find(
          (bet) => bet.team.author !== localStorage.getItem("userId")
        );

        setExistingBet(userBet || null);
        setOpponentBet(oppBet || null);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching matchup and team:", err);
        setError(err.response?.data?.error || "Failed to load matchup details.");
        setLoading(false);
      }
    };

    fetchMatchupAndTeam();
  }, [leagueId, matchupId]);

  const handlePlaceBet = async () => {
    if (!selectedPlayer || !betAmount) {
      setError("Please select a player and enter a bet amount.");
      return;
    }

    if (selectedPlayer.position !== weeklyPosition) {
      setError("Selected player does not match the weekly position.");
      return;
    }

    if (parseFloat(betAmount) > userBalance) {
      setError("Insufficient balance to place this bet.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL1}/api/league/${leagueId}/matchup/${matchupId}/place-bet/`,
        {
          player_id: selectedPlayer.id,
          amount: betAmount,
          position: selectedPlayer.position,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );
      setSuccess("Bet placed successfully!");
      setError("");
      setUserBalance((prev) => prev - parseFloat(betAmount));
      setExistingBet({
        player: selectedPlayer,
        amount: betAmount,
      });
    } catch (err) {
      console.error("Error placing bet:", err);
      setError(err.response?.data?.error || "Failed to place bet.");
      setSuccess("");
    }
  };

  const positionFullName = positionMap[weeklyPosition] || weeklyPosition;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="betting-page">
      <div className="matchup-details">
        <h2>Weekly Matchup Position</h2>
        <p>{positionFullName}</p>
      </div>

      {existingBet ? (
        <div className="bet-summary">
          <h2>Your Bet</h2>
          <p>
            Player: {existingBet.player.name} - {positionMap[existingBet.player.position]} (
            {existingBet.player.position})
          </p>
          <p>Amount: ${existingBet.amount}</p>
          {opponentBet ? (
            <p>
              Opponent Bet: {opponentBet.player.name} - {positionMap[opponentBet.player.position]} (
              {opponentBet.player.position}) for ${opponentBet.amount}
            </p>
          ) : (
            <p>Opponent yet to place their bet.</p>
          )}
        </div>
      ) : (
        <>
          <div className="players-section">
            <div className="players-box">
              <h2>Your Players</h2>
              <ul>
                {players
                  .filter((player) => player.position === weeklyPosition)
                  .map((player) => (
                    <li key={player.id}>
                      <span>
                        {player.name} - {positionMap[player.position]} ({player.position})
                      </span>
                      <button
                        className={`select-button ${
                          selectedPlayer?.id === player.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedPlayer(player)}
                      >
                        {selectedPlayer?.id === player.id ? "Selected" : "Select"}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="players-box">
              <h2>Opponent's Players</h2>
              <ul>
                {opponentPlayers.map((player) => (
                  <li key={player.id}>
                    {player.name} - {positionMap[player.position]} ({player.position})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="place-bet">
            <h2>Place a Bet</h2>
            <label>
              Selected Player: <strong>{selectedPlayer?.name || "None"}</strong>
            </label>
            <label>
              Bet Amount:
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
            </label>
            <button onClick={handlePlaceBet}>Place Bet</button>
          </div>
        </>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default BettingPage;