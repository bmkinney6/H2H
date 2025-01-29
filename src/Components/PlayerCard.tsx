import "../Styles/Index.css";
import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import SearchForm from "../Components/SearchForm.tsx";
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

export default function PlayerCard() {
  const [player, setPlayer] = useState<Player | null>(null); // State to store fetched player data
  const [error, setError] = useState<string | null>(null); // State to store errors

  const API_URL = import.meta.env.VITE_PLAYER_URL;

  const fetchPlayerInfo = async (id: string) => {
    const token = localStorage.getItem(ACCESS_TOKEN); // Get the token from localStorage (or wherever it's stored)
    console.log(token);

    if (!token) {
      console.error("No token found");
      setError("User is not authenticated.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      });
      console.log(response);
      setPlayer(response.data.Player);
    } catch (err) {
      // Type assertion to AxiosError
      const axiosError = err as AxiosError;

      if (axiosError.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", axiosError.response.data);
        console.error("Status code:", axiosError.response.status);
      } else if (axiosError.request) {
        // No response was received
        console.error("Error request:", axiosError.request);
      } else {
        // Something else went wrong
        console.error("Error message:", axiosError.message);
      }
      setError("Failed to fetch player data.");
    }
  };

  return (
    <div>
      <h1 className="text-center">Search Player Info</h1>

      {/* Use the SearchForm component */}
      <SearchForm onSubmit={fetchPlayerInfo} placeholder="Enter Player ID" />

      {/* Show error message if there is an error */}
      {error && <p>{error}</p>}
      <div id="PlayerCard" className="container-sm p-3 mt-3">
        {/* Show player data if available */}
        {player && (
          <div className="player-info text-center">
            <h3>{`${player.firstName} ${player.lastName}`}</h3>
            <h5>{`Team: ${player.team}`}</h5>
            <h5>{`Position: ${player.position}`}</h5>
            <p>{`Jersey #: ${player.jersey}`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
