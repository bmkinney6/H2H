import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Container, Table, Pagination } from "react-bootstrap";
import { ACCESS_TOKEN } from "../constants";
import getPaginationItems from "./Pagination.tsx";
import "../Styles/PlayerSearchList.css";
const teams = [
  { displayName: "Arizona Cardinals", queryName: "Cardinals" },
  { displayName: "Atlanta Falcons", queryName: "Falcons" },
  { displayName: "Baltimore Ravens", queryName: "Ravens" },
  { displayName: "Buffalo Bills", queryName: "Bills" },
  { displayName: "Carolina Panthers", queryName: "Panthers" },
  { displayName: "Chicago Bears", queryName: "Bears" },
  { displayName: "Cincinnati Bengals", queryName: "Bengals" },
  { displayName: "Cleveland Browns", queryName: "Browns" },
  { displayName: "Dallas Cowboys", queryName: "Cowboys" },
  { displayName: "Denver Broncos", queryName: "Broncos" },
  { displayName: "Detroit Lions", queryName: "Lions" },
  { displayName: "Green Bay Packers", queryName: "Packers" },
  { displayName: "Houston Texans", queryName: "Texans" },
  { displayName: "Indianapolis Colts", queryName: "Colts" },
  { displayName: "Jacksonville Jaguars", queryName: "Jaguars" },
  { displayName: "Kansas City Chiefs", queryName: "Chiefs" },
  { displayName: "Las Vegas Raiders", queryName: "Raiders" },
  { displayName: "Los Angeles Chargers", queryName: "Chargers" },
  { displayName: "Los Angeles Rams", queryName: "Rams" },
  { displayName: "Miami Dolphins", queryName: "Dolphins" },
  { displayName: "Minnesota Vikings", queryName: "Vikings" },
  { displayName: "New England Patriots", queryName: "Patriots" },
  { displayName: "New Orleans Saints", queryName: "Saints" },
  { displayName: "New York Giants", queryName: "Giants" },
  { displayName: "New York Jets", queryName: "Jets" },
  { displayName: "Philadelphia Eagles", queryName: "Eagles" },
  { displayName: "Pittsburgh Steelers", queryName: "Steelers" },
  { displayName: "San Francisco 49ers", queryName: "49ers" },
  { displayName: "Seattle Seahawks", queryName: "Seahawks" },
  { displayName: "Tampa Bay Buccaneers", queryName: "Buccaneers" },
  { displayName: "Tennessee Titans", queryName: "Titans" },
  { displayName: "Washington Commanders", queryName: "Commanders" },
];

const positions = ["Quarterback", "Place kicker", "Tight End", "Running Back", "Wide Receiver"];
const statuses = ["Active", "INJURY_STATUS_QUESTIONABLE", "INJURY_STATUS_IR", "INJURY_STATUS_OUT"];

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  position: string;
  yearly_proj: number; // Add yearly_proj to display projections
};

const PlayerSearchList = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    team: "",
    position: "",
    status: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const SEARCH_URL = import.meta.env.VITE_SEARCH_PLAYER_URL;

  const fetchPlayers = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found");
      setError("User is not authenticated.");
      return;
    }

    try {
      const response = await axios.get(SEARCH_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, page: currentPage },
      });

      if (response.data && Array.isArray(response.data.Player)) {
        setPlayers(response.data.Player);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError("Invalid API response structure.");
        setPlayers([]);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error:", axiosError);
      setError("Failed to fetch player data.");
      setPlayers([]);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [currentPage, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, name: e.target.value }));
    setCurrentPage(1); // Reset to first page when name changes
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="d-flex">
      {/* Sidebar for Filters */}
      <div className="sidebar p-3 border-end">
        <h4>Filters</h4>
        <select
          name="team"
          value={filters.team}
          onChange={handleFilterChange}
          className="form-select mb-3"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team.queryName} value={team.queryName}>
              {team.displayName}
            </option>
          ))}
        </select>
        <select
          name="position"
          value={filters.position}
          onChange={handleFilterChange}
          className="form-select mb-3"
        >
          <option value="">All Positions</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
        
      </div>

      {/* Main Content */}
      <Container className="flex-grow-1">
        <h1 className="my-4 text-center">NFL Players</h1>
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleNameSearch}
          className="form-control mb-3"
        />

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            <Table  bordered hover className="player_table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {players.length > 0 ? (
                  players.map((player, index) => (
                    <tr
                      key={`playerlist-${player.id}-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/scout/player/${player.id}`)}
                    >
                      <td>{`${player.firstName} ${player.lastName}`}</td>
                      <td>{player.team}</td>
                      <td>{player.position}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No players found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-3">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {getPaginationItems(currentPage, totalPages, handlePageChange)}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default PlayerSearchList;