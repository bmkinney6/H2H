import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Container, Table, Pagination, Form } from "react-bootstrap";
import { ACCESS_TOKEN } from "../constants";
import getPaginationItems from "./Pagination.tsx";

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  position: string;
};

const PlayerSearchList = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();


  const SEARCH_URL = import.meta.env.VITE_SEARCH_PLAYER_URL;

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        console.error("No token found");
        setError("User is not authenticated.");
        return;
      }

      try {
        let response;
        if (searchTerm.trim()) {
          response = await axios.get(`${SEARCH_URL}?name=${searchTerm}&page=${currentPage}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          response = await axios.get(`${SEARCH_URL}?page=${currentPage}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        console.log("API Response:", response.data);

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

    fetchPlayers();
  }, [currentPage, searchTerm]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent form submission (page refresh)
  };

  return (
    <Container>
      <h1 className="my-4 text-center">NFL Players</h1>

      {/* Search Input */}
      <Form className="mb-3" onSubmit={handleSearchSubmit}>
        <Form.Control
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </Form>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <Table striped bordered hover className="player_table">
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
                  <td colSpan={3} className="text-center">
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
  );
};

export default PlayerSearchList;
