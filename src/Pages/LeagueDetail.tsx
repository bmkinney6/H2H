import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import with {}

import { ACCESS_TOKEN } from "../constants";

interface JwtPayload {
  username: string;
}

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

export default function LeagueDetail() {
  const { id } = useParams();
  const [league, setLeague] = useState<League | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState<string>("");
  const [userJoined, setUserJoined] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (id) {
      fetchLeagueDetail();
    }
  }, [id]);

  const fetchLeagueDetail = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode<JwtPayload>(token); // Correct usage with {}
    const currentUser = decodedToken.username;

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedLeague = response.data;

      if (!fetchedLeague || !fetchedLeague.owner || !fetchedLeague.users) {
        setError("Missing owner or users data.");
        setLoading(false);
        return;
      }

      const userIsInLeague = fetchedLeague.users.some(
        (user: User) => user.username === currentUser
      );

      setLeague(fetchedLeague);
      setIsOwner(fetchedLeague.owner.username === currentUser);
      setUserJoined(userIsInLeague);
      setError(null);
    } catch (err) {
      setError("Failed to fetch league data.");
      console.error("Error fetching league data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPublicLeague = async () => {
    if (!league || league.private) return;

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token); // Add this line to ensure it's defined

      await axios.post(
        `http://localhost:8000/api/leagues/join/public/${league.id}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserJoined(true);
      setLeague((prevLeague) => {
        if (!prevLeague) return null;
        return {
          ...prevLeague,
          users: [...prevLeague.users, { username: decodedToken.username }] // Use decodedToken here
        };
      });
      setError(null);
    } catch (error) {
      console.error("Error joining public league:", error);
      setError("Failed to join the league.");
    }
  };

  const handleJoinPrivateLeague = async () => {
    if (!joinCode.trim()) {
      setError("Please enter a join code.");
      return;
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token); // Add this line to ensure it's defined

      await axios.post(
        `http://localhost:8000/api/leagues/join/private/`,
        { join_code: joinCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserJoined(true);
      setLeague((prevLeague) => {
        if (!prevLeague) return null;
        return {
          ...prevLeague,
          users: [...prevLeague.users, { username: decodedToken.username }] // Use decodedToken here
        };
      });
      setError(null);
    } catch (error) {
      console.error("Error joining private league:", error);
      setError("Failed to join the league.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-center">League Details</h1>

      {error && <p className="text-danger text-center">{error}</p>}

      {league ? (
        <div className="league-info text-center">
          <h3>{league.name}</h3>
          <h5>Owner: {league.owner.username}</h5>
          <p>Draft Date: {new Date(league.draft_date).toLocaleString()}</p>
          <p>Time Per Pick: {league.time_per_pick} seconds</p>
          <p>Positional Betting: {league.positional_betting ? "Enabled" : "Disabled"}</p>
          <p>Max Capacity: {league.max_capacity}</p>

          {!userJoined && !isOwner && (
            <>
              {league.private ? (
                <div>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter Join Code"
                  />
                  <button onClick={handleJoinPrivateLeague}>Join Private League</button>
                </div>
              ) : (
                <button onClick={handleJoinPublicLeague}>Join Public League</button>
              )}
            </>
          )}

          {(userJoined || isOwner) && (
            <button disabled className="btn btn-secondary">
              Already in this league
            </button>
          )}

          {userJoined && <p className="text-success">You have joined this league!</p>}
        </div>
      ) : (
        <p className="text-center">No league found.</p>
      )}
    </div>
  );
}
