
import SearchForm from "../Components/SearchForm.tsx";
import DraftLog from "../Components/DraftLog.tsx";
import DraftPositionDisplay from "../Components/DraftPositionDisplay.tsx";
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

<<<<<<< HEAD
  const [players, setPlayers] = useState<Player[]>([]); // State to store fetched player data
  const [error, setError] = useState<string | null>(null); // State to store errors
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false); // State to track if search has been performed
  const [isMember, setIsMember] = useState<boolean>(false); // State to track if user is a member of the league
  const [draftStarted, setDraftStarted] = useState<boolean>(false); // State to track if the draft has started
  const [draftPicks, setDraftPicks] = useState<any[]>([]); // State to store draft picks
  const [currentPickUser, setCurrentPickUser] = useState<number | null>(null); // State to track whose turn it is
  const [currentPickUsername, setCurrentPickUsername] = useState<string | null>(null); // State to store the username of the current pick user
  const [isCurrentPickUser, setIsCurrentPickUser] = useState<boolean>(false); // State to track if the logged-in user is the current pick user
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // State to track the selected player
  const [availablePositions, setAvailablePositions] = useState<string[]>([]); // State to track available positions
  const [userIdToUsername, setUserIdToUsername] = useState<{ [key: number]: string }>({});
  
=======
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [draftStarted, setDraftStarted] = useState<boolean>(false);
  const [draftPicks, setDraftPicks] = useState<any[]>([]);
  const [currentPickUser, setCurrentPickUser] = useState<number | null>(null);
  const [currentPickUsername, setCurrentPickUsername] = useState<string | null>(null);
  const [isCurrentPickUser, setIsCurrentPickUser] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
>>>>>>> e13f3c4de67df77876cee6c1af52e660def871a1
  const navigate = useNavigate();
  const { leagueId } = useParams<{ leagueId: string }>();
  const [positions, setPositions] = useState<{ [key: string]: Player | null }>({
    QB: null,
    RB1: null,
    RB2: null,
    WR1: null,
    WR2: null,
    TE: null,
    FLX: null,
    K: null,
    DEF: null,
  });
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
              console.log("WebSocket message received:", data);

              if (data.message.type === 'pick_made') {
                setDraftPicks((prevPicks) => [...prevPicks, data.message]);
                setCurrentPickUser(data.message.next_user_id);
              } else if (data.message.type === "draft_complete") {
                alert("Draft complete!");
                navigate("/my-leagues");
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
      }
    };

    checkMembershipAndDraftStatus();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [leagueId]);

  useEffect(() => {
    const fetchCurrentPickUsername = async () => {
      if (currentPickUser !== null) {
        try {
          const token = localStorage.getItem(ACCESS_TOKEN);
          const response = await axios.get(`${API_URL}/api/user/${currentPickUser}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentPickUsername(response.data.username);
        } catch (err) {
          setCurrentPickUsername(null);
        }
      }
    };

    fetchCurrentPickUsername();
  }, [currentPickUser]);

  useEffect(() => {
    const verifyCurrentPickUser = async () => {
      if (currentPickUser !== null) {
        try {
          const token = localStorage.getItem(ACCESS_TOKEN);
          const response = await axios.get(`${API_URL}/api/league/${leagueId}/verify_current_pick_user/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsCurrentPickUser(response.data.isCurrentPickUser);
        } catch (err) {
          setIsCurrentPickUser(false);
        }
      }
    };

    verifyCurrentPickUser();
  }, [currentPickUser, leagueId]);

  const handleFetchPlayerInfo = async (searchTerm: string) => {
    try {
      const fetchedPlayers = await fetchTopTenPlayers(API_URL, searchTerm, draftPicks);
      setPlayers(fetchedPlayers);
      setError(null);
      setSearchPerformed(true);
    } catch (error) {
      setError("Failed to fetch players.");
    }
  };

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await axios.get(`${API_URL}/api/league/${leagueId}/draft-picks/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const picks = response.data.picks;
        setDraftPicks(picks);
  
        // Populate positions for the current user
        const userId = parseInt(localStorage.getItem("user_id") || "0", 10);
        const updatedPositions: { [key: string]: Player | null } = { ...positions };
  
        for (const pick of picks) {
          if (pick.user_id === userId) {
            const playerResponse = await axios.get(`${API_URL}/api/player/${pick.player_id}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const player = playerResponse.data;
  
            updatedPositions[pick.position] = {
              id: player.id,
              firstName: player.firstName,
              lastName: player.lastName,
              position: pick.position,
              headshot: player.headshot,
              status: player.status,
              team: player.team,
              location: player.location,
              weight: player.weight,
              displayHeight: player.displayHeight,
              yearly_proj: player.yearly_proj,
              age: player.age,
              experience: player.experience,
              jersey: player.jersey,
            };
          }
        }
  
        setPositions(updatedPositions); // Update the positions state
      } catch (err) {
        console.error("Error fetching picks:", err);
      }
    };
  
    fetchPicks();
  }, [leagueId]);

  useEffect(() => {
    const fetchPicksAndUsernames = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await axios.get(`${API_URL}/api/league/${leagueId}/draft-picks/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const picks = response.data.picks;
        setDraftPicks(picks);
  
        // Extract unique user IDs from picks
        const userIds = [...new Set(picks.map((pick: any) => pick.user_id))];
  
        // Fetch usernames from the backend
        const usernamesResponse = await axios.post(
          `${API_URL}/api/get-usernames/`,
          { user_ids: userIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setUserIdToUsername(usernamesResponse.data.usernames);
      } catch (err) {
        console.error("Error fetching picks or usernames:", err);
      }
    };
  
    fetchPicksAndUsernames();
  }, [leagueId]);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    const positions = [];

    if (player.position === "Wide Receiver") {
      positions.push("Wide Receiver", "Flex", "Bench");
    } else if (player.position === "Running Back") {
      positions.push("Running Back", "Flex", "Bench");
    } else if (player.position === "Tight End") {
      positions.push("Tight End", "Flex", "Bench");
    } else if (player.position === "Quarterback") {
      positions.push("Quarterback", "Bench");
    } else if (player.position === "Place kicker") {
      positions.push("Place kicker", "Bench");
    }

    setAvailablePositions(positions);
  };

  const handlePick = (playerId: number, position: string) => {
    if (isCurrentPickUser && ws.current) {
      ws.current.send(
          JSON.stringify({
            message: {
              type: 'make_pick',
              user_id: currentPickUser,
              player_id: playerId,
              position: position,
            },
          })
      );
<<<<<<< HEAD

      const pickedPlayer = players.find((player) => player.id === playerId);
      if (pickedPlayer) {
        setPositions((prevPositions) => ({
          ...prevPositions,
          [position]: pickedPlayer,
        }));
      }


      console.log(`Pick sent: Player ID ${playerId}, Position ${position}`); // Debugging pick
    } else {
      console.warn("It's not your turn to pick or WebSocket is not connected."); // Debugging warning
=======
>>>>>>> e13f3c4de67df77876cee6c1af52e660def871a1
    }
  };

  if (!isMember || !draftStarted) {
    return <p className="text-center">{error || "Verifying membership and draft status..."}</p>;
  }

  return (
      <div>
        <h1 className="text-center">Draft Center</h1>
        <div className="draft-section">
          <div className="current-turn text-center">
            {currentPickUser !== null ? (
                isCurrentPickUser ? (
                    <h2>It's your turn to pick!</h2>
                ) : (
                    <h2>It's {currentPickUsername ? `${currentPickUsername}'s` : `User ${currentPickUser}'s`} turn to pick.</h2>
                )
            ) : (
<<<<<<< HEAD
              <h2>It's {currentPickUsername ? `${currentPickUsername}'s` : `User ${currentPickUser}'s`} turn to pick.</h2>
            )
          ) : (
            <h2>Loading turn information...</h2>
          )}
        </div>
  
        {/* Replace the team view */}
        <div className="team-view">
          <DraftPositionDisplay positions={positions} />
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
                            {isCurrentPickUser && (
                              <>
                                {/* Show position selection buttons when a player is selected */}
                                {selectedPlayer?.id === player.id ? (
                                  <div className="position-selection">
                                    <h6>Select Position:</h6>
                                    {availablePositions.map((position) => (
                                      <button
                                        key={position}
                                        onClick={() => handlePick(player.id, position)}
                                        className="btn btn-primary btn-sm m-1"
                                      >
                                        {position}
                                      </button>
                                    ))}
                                    <button
                                      onClick={() => setSelectedPlayer(null)}
                                      className="btn btn-secondary btn-sm m-1"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleSelectPlayer(player)}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Select
                                  </button>
                                )}
                              </>
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
  
        {/* Replace the draft picks section */}
        <div className="draft-picks">
          <DraftLog draftPicks={draftPicks} userIdToUsername={userIdToUsername || {}} />
=======
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
                                  {isCurrentPickUser && (
                                      <>
                                        {selectedPlayer?.id === player.id ? (
                                            <div className="position-selection">
                                              <h6>Select Position:</h6>
                                              {availablePositions.map((position) => (
                                                  <button
                                                      key={position}
                                                      onClick={() => handlePick(player.id, position)}
                                                      className="btn btn-primary btn-sm m-1"
                                                  >
                                                    {position}
                                                  </button>
                                              ))}
                                              <button
                                                  onClick={() => setSelectedPlayer(null)}
                                                  className="btn btn-secondary btn-sm m-1"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSelectPlayer(player)}
                                                className="btn btn-primary btn-sm"
                                            >
                                              Select
                                            </button>
                                        )}
                                      </>
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
>>>>>>> e13f3c4de67df77876cee6c1af52e660def871a1
        </div>
      </div>
  );
}