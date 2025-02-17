import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios";
import { ACCESS_TOKEN } from "../constants";

type League = {
  id: string;
  name: string;
  owner: string;
  draft_date: string;
  time_per_pick: number;
  positional_betting: boolean;
};

export default function LeagueDetail() {
  const { id } = useParams();
  const [league, setLeague] = useState<League | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, ""); // Remove trailing slash if any

  useEffect(() => {
    const fetchLeagueDetail = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN); // Ensure the correct key is used
      if (!token) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("League Details Response:", response.data);
        setLeague(response.data);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError("Failed to fetch league data.");
      }
    };

    if (id) fetchLeagueDetail();
  }, [id, API_URL]); // Include API_URL in the dependency array

  return (
    <div>
      <h1 className="text-center">League Details</h1>

      {error && <p className="text-danger text-center">{error}</p>}

      {league ? (
        <div className="league-info text-center">
          <h3>{league.name}</h3>
          <h5>Owner: {league.owner}</h5>
          <p>Draft Date: {new Date(league.draft_date).toLocaleString()}</p>
          <p>Time Per Pick: {league.time_per_pick} seconds</p>
          <p>Positional Betting: {league.positional_betting ? "Enabled" : "Disabled"}</p>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}
