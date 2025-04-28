import "../Styles/Index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../Components/SearchForm.tsx";

import { fetchPlayerInfo } from "./FetchPlayerInfo.tsx";

export default function PlayerSearchCard() {
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
    headshot: string;
    age: number;
    experience: string;
    jersey: number;
  };

  const [players, setPlayers] = useState<Player[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false); 
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleFetchPlayerInfo = async (name: string) => {
    try {
      const fetchedPlayers = await fetchPlayerInfo(name, API_URL);
      setPlayers(fetchedPlayers); 
      setError(null); 
      setSearchPerformed(true); 
    } catch (error) {
      
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-center">Search Player Info</h1>

      
      <SearchForm
        onSubmit={handleFetchPlayerInfo}
        placeholder="Enter player name"
      />

      
      {error && <p>{error}</p>}

      <div id="PlayerCard" className="container-sm p-3 mt-3">
       
        {!searchPerformed && <p>Please enter a player's name.</p>}

       
        {searchPerformed && players.length > 0 ? (
          <div>
            <h3>Results:</h3>
            <ul className="list-group">
              {players.map((player) => (
                <li
                  key={`playercard-${player.id}`} 
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/scout/player/${player.id}`)} 
                >
                  <img
                    src={player.headshot}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="player-headshot rounded-circle w-auto mx-auto"
                  />
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
          ) 
        )}
      </div>
    </div>
  );
}
