import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants.tsx";

type League = {
  id: string;
  name: string;
  owner: string;
  draft_date: string;
  private: boolean;
  positional_betting: boolean;
  draftStarted: boolean;
  draftComplete: boolean;
};

const SearchLeague: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    private: "",
    positional_betting: "",
    draft_status: "",
    draft_date: "",
    page: 1,
  });
  const [nameQuery, setNameQuery] = useState<string>(""); // Separate name search
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const API_URL = "http://localhost:8000/api/leagues/search/";

  const fetchLeagues = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      console.log("Filters being sent to the backend:", { ...filters, name: nameQuery }); // Debugging log
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, name: nameQuery }, // Include name query
      });
  
      console.log("Response from backend:", response.data); // Debugging log
      setLeagues(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Error fetching leagues:", err);
      setError("Failed to fetch leagues.");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    console.log(`Filter updated: ${name} = ${value}`); // Debugging log
  };

  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameQuery(e.target.value);
    fetchLeagues(); // Immediately update results for name search
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    fetchLeagues(); // Trigger search
  };

  const handleApplyFilters = () => {
    fetchLeagues(); // Trigger search when "Apply Filters" is clicked
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    fetchLeagues(); // Fetch leagues for the selected page
  };

  return (
    <div className="d-flex">
      {/* Sidebar for Filters */}
      <div className="sidebar p-3 border-end">
        <h4>Filters</h4>
        <label>Private/Public</label>
        <select
          name="private"
          value={filters.private}
          onChange={handleFilterChange}
          className="form-select mb-3"
        >
          <option value="">All</option>
          <option value="1">Private</option>
          <option value="0">Public</option>
        </select>
        <label>Positional Betting</label>
        <select
          name="positional_betting"
          value={filters.positional_betting}
          onChange={handleFilterChange}
          className="form-select mb-3"
        >
          <option value="">All</option>
          <option value="1">Enabled</option>
          <option value="0">Disabled</option>
        </select>
        <label>Draft Status</label>
        <select
          name="draft_status"
          value={filters.draft_status}
          onChange={handleFilterChange}
          className="form-select mb-3"
        >
          <option value="">All</option>
          <option value="0">Not Started</option>
          <option value="1">In Progress</option>
          <option value="2">Completed</option>
        </select>
        <label>Draft Date</label>
        <input
          type="date"
          name="draft_date"
          value={filters.draft_date}
          onChange={handleFilterChange}
          className="form-control mb-3"
        />
        <button onClick={handleApplyFilters} className="btn btn-primary w-100">
          Apply Filters
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-3">
        <h1 className="text-center">Search Leagues</h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by Name"
            value={nameQuery}
            onChange={handleNameSearch}
            className="form-control mb-3"
          />
        </form>

        {error && <p className="text-danger text-center">{error}</p>}

        {searchPerformed && leagues.length > 0 ? (
          <ul className="list-group">
            {leagues.map((league) => (
              <li
                key={league.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/leagues/${league.id}`)}
              >
                {league.name} - {league.private ? "Private" : "Public"}
              </li>
            ))}
          </ul>
        ) : (
          searchPerformed && <p className="text-center">No leagues found.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination mt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${filters.page === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchLeague;