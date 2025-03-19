import OffenseLineup from "../Components/OffenseLineup.tsx";
import DefenseLineup from "../Components/DefenseLinup.tsx";
import BenchPlayers from "../Components/Bench.tsx";
import SearchForm from "../Components/SearchForm.tsx";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTopTenPlayers } from "../Components/FetchPlayerInfo.tsx";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

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
  const [isMember, setIsMember] = useState<boolean>(false); // State to track if user is a member of the league
  const [draftStarted, setDraftStarted] = useState<boolean>(false); // State to track if the draft has started
  const [draftPicks, setDraftPicks] = useState<any[]>([]); // State to store draft picks
  const [currentPickUser, setCurrentPickUser] = useState<number | null>(null); // State to track whose turn it is
  const navigate = useNavigate();
  const { leagueId } = useParams<{ leagueId: string }>();
  const ws = useRef<WebSocket | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkMembershipAndDraftStatus = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      try {
        const membershipResponse = await axios.get(`${API_URL}/api/league/${leagueId}/check_membership/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (membershipResponse.data.success) {
          setIsMember(true);

          const draftStatusResponse = await axios.get(`${API_URL}/api/league/${leagueId}/check_draft_status/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (draftStatusResponse.data.draftStarted) {
            setDraftStarted(true);
            setCurrentPickUser(draftStatusResponse.data.currentPickUser);

            // Initialize WebSocket connection
            ws.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/draft/${leagueId}/`);

            ws.current.onmessage = (event) => {
              const data = JSON.parse(event.data);
              if (data.message.type === 'pick_made') {
                setDraftPicks((prevPicks) => [...prevPicks, data.message]);
                setCurrentPickUser(data.message.next_user_id);
              }
            };

            ws.current.onerror = (err) => {
              console.error("WebSocket error:", err);
            };
          } else {
            setError("The draft has not started yet.");
          }
        } else {
          setError(membershipResponse.data.error || "You are not a member of this league.");
        }
      } catch (err) {
        setError("Failed to verify membership or draft status.");
        console.error("Error verifying membership or draft status:", err);
      }
    };

    checkMembershipAndDraftStatus();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [leagueId]);

  const handleFetchPlayerInfo = async (searchTerm: string) => {
    try {
      const fetchedPlayers = await fetchTopTenPlayers(API_URL, searchTerm, draftPicks); // Pass the search term and draft picks
      setPlayers(fetchedPlayers); // Save all players
      setError(null); // Reset error
      setSearchPerformed(true); // Indicate that search was performed
    } catch (error) {
      setError("Failed to fetch players.");
      console.error("Error fetching players:", error);
    }
  };

  const handlePick = (playerId: number, position: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        message: {
          type: 'make_pick',
          user_id: localStorage.getItem('user_id'), // Assuming user_id is stored in localStorage
          player_id: playerId,
          position: position,
        }
      }));
    }
  };

  if (!isMember || !draftStarted) {
    return <p className="text-center">{error || "Verifying membership and draft status..."}</p>;
  }

  return (
    <div>
      <h1 className="text-center">Draft Center</h1>
      <div className="draft-section">
        {/* Display whose turn it is */}
        <div className="current-turn text-center">
          {currentPickUser !== null ? (
            currentPickUser === parseInt(localStorage.getItem('user_id') || '') ? (
              <h2>It's your turn to pick!</h2>
            ) : (
              <h2>It's User {currentPickUser}'s turn to pick.</h2>
            )
          ) : (
            <h2>Loading turn information...</h2>
          )}
        </div>

        <div className="team-view d-block">
          <BenchPlayers />
          <DefenseLineup />
          <OffenseLineup />
        </div>
        <div className="draft-search">
          <div className="draft-search-container text-center mx-auto">
            <SearchForm
              onSubmit={handleFetchPlayerInfo} // Handle search term on form submit
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
                            {currentPickUser === parseInt(localStorage.getItem('user_id') || '') && (
                              <button onClick={() => handlePick(player.id, player.position)}>Pick</button>
                            )}
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
              )
            )}
          </div>
          {error && <p>{error}</p>}
        </div>
        <div className="draft-picks">
          <h2>Draft Picks</h2>
          <ul>
            {draftPicks.map((pick, index) => (
              <li key={index}>{`User ${pick.user_id} picked ${pick.player_name} (${pick.position})`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}