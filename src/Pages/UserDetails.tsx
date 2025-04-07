import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

type League = {
  id: number;
  name: string;
  draftStarted: boolean;
};

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const [userLeagues, setUserLeagues] = useState<League[]>([]);
  const [eligibleLeagues, setEligibleLeagues] = useState<League[]>([]);
  const [invitedLeagues, setInvitedLeagues] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLeagues = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("You are not authenticated.");
        return;
      }

      try {
        // Fetch leagues the searched user is already in
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/leagues/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserLeagues(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user leagues:", err);
        setError("Failed to fetch user leagues.");
      }
    };

    const fetchEligibleLeagues = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("You are not authenticated.");
        return;
      }

      try {
        // Fetch leagues the logged-in user owns and can invite the searched user to
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/eligible-leagues/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEligibleLeagues(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching eligible leagues:", err);
        setError("Failed to fetch eligible leagues.");
      }
    };

    fetchUserLeagues();
    fetchEligibleLeagues();
  }, [userId]);

  const handleInvite = async (leagueId: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/leagues/${leagueId}/invite/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage(response.data.success);
      setInvitedLeagues((prev) => [...prev, leagueId]); // Mark the league as invited
    } catch (err) {
      console.error("Error inviting user:", err);
      setError("Failed to invite user.");
    }
  };

  return (
    <div className="container">
      <h1>User Profile</h1>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}

      {/* Leagues the searched user is already in */}
      <h2>Leagues</h2>
      <ul className="list-group">
        {userLeagues.map((league) => (
          <li key={league.id} className="list-group-item">
            {league.name}
          </li>
        ))}
      </ul>

      {/* Invite to League Section */}
      <h2 className="mt-4">Invite to League</h2>
      {eligibleLeagues.length > 0 ? (
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="inviteDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Select a League
          </button>
          <ul className="dropdown-menu" aria-labelledby="inviteDropdown">
            {eligibleLeagues.map((league) => (
              <li key={league.id}>
                <button
                  className="dropdown-item"
                  onClick={() => handleInvite(league.id)}
                  disabled={invitedLeagues.includes(league.id)} // Disable if already invited
                >
                  {league.name} {invitedLeagues.includes(league.id) && "(Invited)"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No eligible leagues to invite this user to.</p>
      )}
    </div>
  );
}