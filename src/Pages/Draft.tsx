import OffenseLineup from "../Components/OffenseLineup.tsx";
import DefenseLineup from "../Components/DefenseLinup.tsx";
import BenchPlayers from "../Components/Bench.tsx";
import SearchForm from "../Components/SearchForm.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopTenPlayers } from "../Components/FetchPlayerInfo.tsx";

export default function Draft() {
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
    yearly_proj: number;
    headshot: string;
    age: number;
    experience: string;
    jersey: number;
  };

  const [players, setPlayers] = useState<Player[]>([]); // State to store fetched player data
  const [error, setError] = useState<string | null>(null); // State to store errors
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false); // State to track if search has been performed
  useNavigate();
  // Hook for navigation

  const API_URL = import.meta.env.VITE_API_URL;

  const handleFetchPlayerInfo = async (name: string) => {
    try {
      const fetchedPlayers = await fetchTopTenPlayers(API_URL);
      setPlayers(fetchedPlayers); // Save all players
      setError(null); // Reset error
      setSearchPerformed(true); // Indicate that search was performed
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError(error.message);
    }
  };
  return (
    <div>
      <h1 className="text-center">Draft Center</h1>
      <div className="draft-section">
        <div className="team-view  d-block">
          <BenchPlayers />
          <DefenseLineup />
          <OffenseLineup />
        </div>
        <div className="draft-search">
          <div className="draft-search-container text-center mx-auto">
            <SearchForm
              onSubmit={handleFetchPlayerInfo}
              placeholder="Enter player name"
            />
            {searchPerformed && players.length > 0 ? (
              <div>
                <h2>Results:</h2>
                <div className="results-container">
                  <div className="row g-4">
                    {players.map((player) => (
                      <div key={player.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100">
                          <img
                            src={player.headshot}
                            className="card-img-top rounded-circle w-75 mx-auto mt-3 h-auto"
                            alt={`${player.firstName} ${player.lastName}`}
                          />
                          <div className="card-body text-center">
                            <h5 className="card-title">
                              {player.firstName} {player.lastName}
                            </h5>
                            <p className="card-text">{player.team}</p>
                            <p className="card-text">{player.position}</p>
                            <p className="card-text">
                              {player.displayHeight} - {player.weight} lbs
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              searchPerformed && (
                <p className="no-players-message">
                  No players found with that name.
                </p>
              ) // Show this message after search if no players are found
            )}
          </div>
          {/* Show error message if there is an error */}
          {error && <p>{error}</p>}
        </div>
        {/*<div className="top-players overflow-y-auto">*/}
        {/*  <TopTenPlayers />*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
