import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios";
import { ACCESS_TOKEN } from "../constants.tsx";

type Player = {
  id: number;
  status: string;
  position: string;
  firstName: string;
  lastName: string;
  team: string;
  location: string;
  weight: number;
  displayHeight: string;
  age: number;
  experience: string;
  jersey: number;
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
        console.log("API Response:", response.data);

        setPlayer(response.data.Player);
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

  useEffect(() => {
    if (player) {
      console.log("Player Object:", player);  // Log after player is updated
    }
  }, [player]);

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
          <button onClick={() => navigate("/scout")}>Back to Search</button> {/* Button to go back to the search page */}
        </div>
      )}
    </div>
  );
}
