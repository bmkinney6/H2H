import { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import '../Styles/MyLeagues.css';

type User = {
  username: string;
};

type League = {
  id: string;
  name: string;
  owner: User;
  draft_date: string;
  time_per_pick: number;
  positional_betting: boolean;
  max_capacity: number;
  private: boolean;
  join_code?: string;
  users: Array<User>;
};

export default function MyLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joinCode, setJoinCode] = useState<string>('');
  const [joinError, setJoinError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching leagues from:", `${API_URL}/myleagues`);
      const response = await axios.get(`${API_URL}/myleagues`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched leagues:", response.data);
      const uniqueLeagues = removeDuplicateLeagues(response.data);
      setLeagues(uniqueLeagues);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leagues.");
      console.error("Error fetching leagues:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicateLeagues = (leagues: League[]) => {
    const uniqueLeaguesMap = new Map<string, League>();
    leagues.forEach((league) => {
      if (!uniqueLeaguesMap.has(league.id)) {
        uniqueLeaguesMap.set(league.id, league);
      }
    });
    return Array.from(uniqueLeaguesMap.values());
  };

  const handleJoinLeague = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setJoinError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/join/private/`, { join_code: joinCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === "Successfully joined the league!") {
        fetchLeagues(); // Refresh the leagues list
        setJoinCode('');
        setJoinError(null);
      } else {
        setJoinError(response.data.error || "Failed to join the league.");
      }
    } catch (err) {
      setJoinError("Failed to join the league.");
      console.error("Error joining league:", err);
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="my-leagues-container">
      <div className="leagues-sidebar">
        <ul className="league-list">
          {leagues.map((league) => (
            <li
              key={league.id}
              className={`league-tab ${selectedLeague?.id === league.id ? 'selected' : ''}`}
              onClick={() => setSelectedLeague(league)}
            >
              {league.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="league-details-container">
        <div className="my-leagues-title">
          <h1>My Leagues</h1>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <div className="league-details">
          {selectedLeague ? (
            <div className="league-info">
              <h3>{selectedLeague.name}</h3>
              <p>Owner: {selectedLeague.owner.username}</p>
              <p>Draft Date: {new Date(selectedLeague.draft_date).toLocaleString()}</p>
              <p>Time Per Pick: {selectedLeague.time_per_pick} seconds</p>
              <p>Positional Betting: {selectedLeague.positional_betting ? "Enabled" : "Disabled"}</p>
              <p>Max Capacity: {selectedLeague.max_capacity}</p>
            </div>
          ) : (
            <p className="text-center">Select a league to view details.</p>
          )}
        </div>

        <div className="join-league-container">
          <h3 className="join-league-title">Join a Private League</h3>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter join code"
          />
          <button onClick={handleJoinLeague}>Join League</button>
          {joinError && <p className="text-danger">{joinError}</p>}
        </div>
      </div>
    </div>
  );
}