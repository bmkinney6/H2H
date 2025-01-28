import "../Styles/Index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [player, setPlayer] = useState<Player | null>(null); // Player state
  const [error, setError] = useState<string | null>(null); // Error state
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`${API_URL}/3049698`); // Replace 3049698 with dynamic ID
        setPlayer(response.data.Player);
      } catch (err) {
        console.error("Error fetching player:", err);
        setError("Failed to fetch player data.");
      }
    };

    fetchPlayer();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      id="PlayerCard"
      className="container-sm d-flex flex-column justify-content-center align-items-center p-3"
    >
      {player ? (
        <div className="player-card mb-4 p-3 d-flex flex-column align-items-center">
          <img
            src="src/assets/H2HLogo.jpg"
            id={`PlayerCardImg-${player.id}`}
            className="rounded-circle mb-2 mt-5"
            width={100}
            height={100}
            alt={`Headshot of ${player.lastName}`}
          />
          <h3 className="text-center">{`${player.firstName} ${player.lastName}`}</h3>
          <h5 className="text-center ">{player.team}</h5>
          <h5 className="text-center">{player.position}</h5>
          <p className="text-center">{`Jersey #: ${player.jersey}`}</p>
        </div>
      ) : (
        <p>Loading player...</p>
      )}
    </div>
  );
}
