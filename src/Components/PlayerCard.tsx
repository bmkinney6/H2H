import "../Styles/Index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../Components/SearchForm.tsx";

import { fetchPlayerInfo } from "./FetchPlayerInfo.tsx";

export default function PlayerCard() {
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

  const [players, setPlayers] = useState<Player[]>([]); // State to store fetched player data
  const [error, setError] = useState<string | null>(null); // State to store errors
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false); // State to track if search has been performed
  const navigate = useNavigate(); // Hook for navigation

  const API_URL = import.meta.env.VITE_API_URL;

  const handleFetchPlayerInfo = async (name: string) => {
    try {
      const fetchedPlayers = await fetchPlayerInfo(name, API_URL);
      setPlayers(fetchedPlayers); // Save all players
      setError(null); // Reset error
      setSearchPerformed(true); // Indicate that search was performed
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-center">Search Player Info</h1>

      {/* Use the SearchForm component */}
      <SearchForm
        onSubmit={handleFetchPlayerInfo}
        placeholder="Enter player name"
      />

      {/* Show error message if there is an error */}
      {error && <p>{error}</p>}

      <div id="PlayerCard" className="container-sm p-3 mt-3">
        {/* Display initial message when no search has been performed */}
        {!searchPerformed && <p>Please enter a player's name.</p>}

        {/* Show results or a message if no players are found */}
        {searchPerformed && players.length > 0 ? (
          <div>
            <h3>Results:</h3>
            <ul className="list-group">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/scout/player/${player.id}`)} // Navigate to the player detail page
                >
                  {`${player.firstName} ${player.lastName} - ${player.team} (${player.position})`}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          searchPerformed && (
            <p className="no-players-message">
              No players found with that name.
            </p>
          ) // Show this message after search if no players are found
        )}
      </div>
    </div>
  );
}
