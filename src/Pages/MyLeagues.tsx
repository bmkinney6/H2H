import { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { checkLoginStatus } from "../Components/checkLoginStatus";
import { useNavigate } from "react-router-dom";
import "../Styles/MyLeagues.css";
import LoaderLink from "../Components/LoaderLink";

type User = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
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
  draftStarted: boolean;
  draftComplete: boolean;
};

type Team = {
  user_id: string;
  username: string;
  team: {
    team_title: string;
    players: { [key: string]: string };
  } | null;
};

type MyLeaguesProps = {
  setGlobalLoading: (value: boolean) => void;
};

export default function MyLeagues({ setGlobalLoading }: MyLeaguesProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joinCode, setJoinCode] = useState<string>("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    draft_date: "",
    time_per_pick: 15,
    positional_betting: false,
    max_capacity: 10,
    private: true,
    join_code: "",
  });
  const positionMap: { [key: string]: string } = {
    QB: "Quarterback",
    RB1: "Running Back 1",
    RB2: "Running Back 2",
    WR1: "Wide Receiver 1",
    WR2: "Wide Receiver 2",
    TE: "Tight End",
    FLX: "Flex",
    K: "Kicker",
    DEF: "Defense",
    BN1: "Bench 1",
    BN2: "Bench 2",
    BN3: "Bench 3",
    BN4: "Bench 4",
    BN5: "Bench 5",
    BN6: "Bench 6",
    IR1: "Injured Reserve 1",
    IR2: "Injured Reserve 2",
  };
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]); 
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");
  const API_URL1 = import.meta.env.VITE_API_URL.replace(/\/$/, "");

  useEffect(() => {
    fetchLeagues();
    fetchUserDetails();
    checkLoginStatus().then((status) => {
      if (status.isLoggedIn) {
        setCurrentUsername(status.username ?? null);
      } else {
        setError("You are not authenticated. Please log in.");
      }
    });
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague.id);
    }
  }, [selectedLeague]);


  const fetchLeagues = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/myleagues`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uniqueLeagues = removeDuplicateLeagues(response.data);
      setLeagues(uniqueLeagues);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leagues.");
      console.error("Error fetching leagues:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (leagueId: string) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL1}/api/leagues/${leagueId}/users-and-teams/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTeams(response.data); 
    } catch (err) {
      setError("Failed to fetch teams.");
      console.error("Error fetching teams:", err);
    }
  };


  const removeDuplicateLeagues = (leagues: League[]) => {
    const uniqueLeaguesMap = new Map<string, League>();
    leagues.forEach((league) => {
      if (!uniqueLeaguesMap.has(league.id)) {
        uniqueLeaguesMap.set(league.id, league);
      }
    });
    return Array.from(uniqueLeaguesMap.values());
  };

  const handleJoinLeague = async () => {
    if (!joinCode.trim()) {
      setJoinError("Please enter a join code.");
      return;
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setJoinError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/join/private/`,
        { join_code: joinCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setJoinError(null);
        fetchLeagues();
      } else {
        setJoinError(response.data.error || "Failed to join the league.");
      }
    } catch (err) {
      setJoinError("Failed to join the league.");
      console.error("Error joining league:", err);
    }
  };

  const handleLeaveLeague = async (leagueId: string) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/${leagueId}/leave/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        window.location.reload();
      } else {
        setError(response.data.error || "Failed to leave the league.");
      }
    } catch (err) {
      setError("Failed to leave the league.");
      console.error("Error leaving league:", err);
    }
  };

  const handleDeleteLeague = async (leagueId: string) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/${leagueId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const [teams, setTeams] = useState<Team[]>([]); // New state for teams
      if (response.status === 200) {
        window.location.reload();
      } else {
        setError(response.data.error || "Failed to delete the league.");
      }
    } catch (err) {
      setError("Failed to delete the league.");
      console.error("Error deleting league:", err);
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    if (!selectedLeague) return;

    const updatedSettings = {
      max_capacity: settings.max_capacity,
      private: settings.private,
    };

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setSettingsError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/${selectedLeague.id}/update_settings/`,
        updatedSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchLeagues(); // Refresh the leagues list
        setSettingsVisible(false);
        setSettingsError(null);
      } else {
        setSettingsError(response.data.error || "Failed to update settings.");
      }
    } catch (err) {
      setSettingsError("Failed to update settings.");
      console.error("Error updating settings:", err);
    }
  };

  const handleStartDraft = async () => {
    if (!selectedLeague) return;

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setDraftError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/league/${selectedLeague.id}/start_draft/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchLeagues();
        setDraftError(null);
        navigate(`/draft/${selectedLeague.id}`);
      } else {
        setDraftError(response.data.error || "Failed to start the draft.");
      }
    } catch (err) {
      setDraftError("Failed to start the draft.");
      console.error("Error starting draft:", err);
    }
  };

  const handleJoinDraft = () => {
    if (!selectedLeague) return;
    navigate(`/draft/${selectedLeague.id}`);
  };

  

  const fetchUserDetails = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL1}/api/user/info/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data.user.id);
    } catch (err) {
      setError("Failed to fetch user details.");
      console.error("Error fetching user details:", err);
    }
  };

  const fetchPlayerDetails = async (playerIds: string[]) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL1}/api/player/batch-info/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ids: playerIds },
      });
  
      const players = response.data.Players.reduce((acc: any, player: any) => {
        acc[player.id] = `${player.firstName} ${player.lastName}`;
        return acc;
      }, {});
  
      return players;
    } catch (err) {
      setError("Failed to fetch player details.");
      console.error("Error fetching player details:", err);
      return {};
    }
  };
  
  const handleTeamSelection = async (team: Team) => {
    try {
      setSelectedTeam(team);
  
      if (team.team && team.team.players) {
        const playerIds = Object.values(team.team.players).filter(
          (id) => id && id !== "N/A"
        );
  
        if (playerIds.length === 0) {
          console.warn("No valid player IDs found.");
          return;
        }
  
        const playerDetails = await fetchPlayerDetails(playerIds);
  
        if (!playerDetails) {
          console.error("Failed to fetch player details.");
          return;
        }
  
        const updatedPlayers = Object.entries(team.team.players).reduce(
          (acc: Record<string, string>, [position, playerId]) => {
            acc[position] = playerDetails[playerId] || "N/A";
            return acc;
          },
          {}
        );
  
        setSelectedTeam((prev) => ({
          ...prev,
          team: {
            ...prev?.team,
            players: updatedPlayers,
          },
        }));
      }
    } catch (error) {
      console.error("Error in handleTeamSelection:", error);
      setError("Failed to select the team.");
    }
  };
  
  const handleLeagueSelection = (league: League) => {
    setSelectedLeague(league);
    setSelectedTeam(null); // Clear the selected team
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="my-leagues-container">
      {/* Sidebar */}
      <div className="leagues-sidebar">
                {/* League Tabs */}
        <ul className="league-list">
          {leagues.map((league) => (
            <li
              key={league.id}
              className={`league-tab ${selectedLeague?.id === league.id ? "selected" : ""}`}
              onClick={() => handleLeagueSelection(league)}
            >
              {league.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Team Display */}
        <div className={`team-display ${teams.length === 0 ? "empty" : ""}`}>
          <h4 className="team-display-title">Teams in League</h4>
          {teams.length > 0 ? (
            <ul className="team-list">
              {teams.map((team) => (
                <li
                  key={team.user_id}
                  className="team-item"
                  onClick={() => handleTeamSelection(team)}
                >
                  <strong>{team.username}</strong>
                  <p>{team.team?.team_title || "No team assigned"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-teams-message">Draft has yet to begin.</p>
          )}
          {selectedTeam && selectedTeam.team && (
            <div className="selected-team">
              <button
                className="close-team-btn"
                onClick={() => setSelectedTeam(null)}
              >
                X
              </button>
              <h5>{selectedTeam.username}'s Team</h5>
              <ul className="player-list">
                {Object.entries(selectedTeam.team.players).map(([position, player]) => (
                  <li key={position} className="player-item">
                    <span className="player-position">
                      {positionMap[position] || position}:
                    </span>
                    <span className="player-name">{player}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* League Details */}
        <div className="league-details-container">
          {selectedLeague ? (
            <div className="league-info">
              <h3>{selectedLeague.name}</h3>
              <p>Owner: {selectedLeague.owner.username}</p>
              <p>Max Capacity: {selectedLeague.max_capacity}</p>
              <p>Private: {selectedLeague.private ? "Yes" : "No"}</p>
              <p>Join Code: {selectedLeague.join_code || "N/A"}</p>

              <div className="league-actions">
                {/* Join Draft Button */}
                {selectedLeague.draftStarted && !selectedLeague.draftComplete && (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => navigate(`/draft/${selectedLeague.id}`)}
                  >
                    Join Draft
                  </button>
                )}

                {/* League Details Button */}
                {selectedLeague.draftComplete && (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => navigate(`/league/${selectedLeague.id}/${userId}`)}
                  >
                    League Details
                  </button>
                )}
              </div>

              

              {/* Conditional Buttons for League Owner */}
              {currentUsername === selectedLeague.owner.username && (
                <>
                  {!selectedLeague.draftStarted && (
                    <button
                      className="btn btn-success mt-2"
                      onClick={handleStartDraft}
                    >
                      Start Draft
                    </button>
                  )}

                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => setSettingsVisible(!settingsVisible)}
                  >
                    {settingsVisible ? "Close Settings" : "Open Settings"}
                  </button>

                  {settingsVisible && (
                    <div className="league-settings">
                      <h4>League Settings</h4>
                      <div>
                        <label>
                          Max Capacity:
                          <input
                            type="number"
                            name="max_capacity"
                            value={settings.max_capacity}
                            onChange={handleSettingsChange}
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Private:
                          <input
                            type="checkbox"
                            name="private"
                            checked={settings.private}
                            onChange={handleSettingsChange}
                          />
                        </label>
                      </div>
                      <button onClick={handleSaveSettings}>Save Settings</button>
                      {settingsError && <p className="text-danger">{settingsError}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-center">Select a league to view details.</p>
          )}

          {/* Join Private League */}
          <div className="join-league-container">
            <h3 className="join-league-title">Join a Private League</h3>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter join code"
            />
            <button onClick={handleJoinLeague}>Join League</button>
            {joinError && <p className="text-danger">{joinError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}