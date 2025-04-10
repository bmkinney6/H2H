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
  draftComplete: boolean; // Added field to track if the draft is complete
};

type MyLeaguesProps = {
  setGlobalLoading: (value: boolean) => void;
};

export default function MyLeagues({ setGlobalLoading }: MyLeaguesProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
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
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_LEAGUE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetchLeagues();
    checkLoginStatus().then((status) => {
      if (status.isLoggedIn) {
        setCurrentUsername(status.username ?? null);
      } else {
        setError("You are not authenticated. Please log in.");
      }
    });
  }, []);

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
        fetchLeagues(); // Refresh the leagues list after joining
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
        window.location.reload() // Redirect to MyLeagues page after leaving
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

      if (response.status === 200) {
        window.location.reload() // Redirect to MyLeagues page after deleting
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

    const formattedDraftDate = new Date(settings.draft_date).toISOString().slice(0, 19);

    const updatedSettings = {
      ...settings,
      draft_date: formattedDraftDate,
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
        fetchLeagues();
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
        fetchLeagues(); // Refresh the leagues list
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

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="my-leagues-container">
      <div className="leagues-sidebar">
        <ul className="league-list">
          {leagues.map((league) => (
            <li
              key={league.id}
              className={`league-tab ${selectedLeague?.id === league.id ? "selected" : ""}`}
              onClick={() => setSelectedLeague(league)}
            >
              <LoaderLink to={`/league/${league.id}`} setGlobalLoading={setGlobalLoading}>
                {league.name}
              </LoaderLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="league-details-container">
        <div className="my-leagues-title">
          <h1>My Leagues</h1>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <div className="league-details">
          {selectedLeague ? (
            <div className="league-info">
              <h3>{selectedLeague.name}</h3>
              <p>Owner: {selectedLeague.owner.username}</p>
              <p>Draft Date: {new Date(selectedLeague.draft_date).toLocaleString()}</p>
              <p>Time Per Pick: {selectedLeague.time_per_pick} seconds</p>
              <p>Positional Betting: {selectedLeague.positional_betting ? "Enabled" : "Disabled"}</p>
              <p>Max Capacity: {selectedLeague.max_capacity}</p>
              <p>Private: {selectedLeague.private ? "Yes" : "No"}</p>
              <p>Join Code: {selectedLeague.join_code || "N/A"}</p>

              {/* Draft Status */}
              <p>
                <strong>Draft Status:</strong>{" "}
                {selectedLeague.draftComplete
                  ? "Completed"
                  : selectedLeague.draftStarted
                  ? "In-progress"
                  : "Not Started"}
              </p>

              {currentUsername === selectedLeague.owner.username && (
                <>
                  <button onClick={() => setSettingsVisible(!settingsVisible)}>
                    {settingsVisible ? "Close Settings" : "Open Settings"}
                  </button>
                  {settingsVisible && (
                    <div className="league-settings">
                      <h4>League Settings</h4>
                      <div>
                        <label>
                          Draft Date:
                          <input
                            type="datetime-local"
                            name="draft_date"
                            value={settings.draft_date}
                            onChange={handleSettingsChange}
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Time Per Pick (seconds):
                          <input
                            type="number"
                            name="time_per_pick"
                            value={settings.time_per_pick}
                            onChange={handleSettingsChange}
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Positional Betting:
                          <input
                            type="checkbox"
                            name="positional_betting"
                            checked={settings.positional_betting}
                            onChange={handleSettingsChange}
                          />
                        </label>
                      </div>
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
                      <div>
                        <label>
                          Join Code:
                          <input
                            type="text"
                            name="join_code"
                            value={settings.join_code}
                            onChange={handleSettingsChange}
                          />
                        </label>
                      </div>
                      <button onClick={handleSaveSettings}>Save Settings</button>
                      {settingsError && <p className="text-danger">{settingsError}</p>}
                    </div>
                  )}

                  {!selectedLeague.draftStarted && (
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => handleDeleteLeague(selectedLeague.id)}
                    >
                      Delete League
                    </button>
                  )}
                </>
              )}

              {currentUsername !== selectedLeague.owner.username && !selectedLeague.draftStarted && (
                <button
                  className="btn btn-warning mt-2"
                  onClick={() => handleLeaveLeague(selectedLeague.id)}
                >
                  Leave League
                </button>
              )}

              {selectedLeague.draftStarted && !selectedLeague.draftComplete && (
                <button onClick={handleJoinDraft}>Join Draft</button>
              )}
            </div>
          ) : (
            <p className="text-center">Select a league to view details.</p>
          )}
        </div>

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
  );
}