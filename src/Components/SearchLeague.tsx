import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants.tsx";
import SearchLeagueForm from "../Components/SearchLeagueForm.tsx"; // Import new search form

type League = {
  id: string;
  name: string;
  owner: string;
  draft_date: string;
};

const SearchLeague: React.FC = () => {  // <-- Make sure this does NOT expect props
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:8000/search_leagues/";


  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
  
    const token = localStorage.getItem(ACCESS_TOKEN); // Ensure the correct key is used
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}?name=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Search Query:", query); // Log search query
      console.log("API Response:", response.data); // Log API Response
      console.log("Leagues:", response.data.results); // Log leagues array
  
      setLeagues(response.data.results || []);
      setError(null);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Error fetching leagues:", err);
      setError("Failed to fetch leagues.");
    }
  };
  
  
  

  return (
    <div>
      <h1 className="text-center">Search Leagues</h1>

      {/* Use the league-specific search form */}
      <SearchLeagueForm onSearch={handleSearch} />

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="container mt-3">
        {!searchPerformed && <p className="text-center">Please enter a league name.</p>}

        {searchPerformed && leagues.length > 0 ? (
          <ul className="list-group">
            {leagues.map((league) => (
              <li
                key={league.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/leagues/${league.id}`)}
              >
                {league.name}
              </li>
            ))}
          </ul>
        ) : (
          searchPerformed && <p className="text-center">No leagues found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchLeague;
