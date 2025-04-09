import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

type User = {
  id: number;
  username: string;
};

export default function UserSearch() {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/users/search/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { username: query },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error searching for users:", err);
      setError("Failed to search for users.");
    }
  };

  const handleUserClick = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="container">
      <h1>User Search</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={handleSearch}>
        Search
      </button>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item list-group-item-action"
            onClick={() => handleUserClick(user.id)}
            style={{ cursor: "pointer" }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}