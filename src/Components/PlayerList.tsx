import "../Styles/Index.css";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Container, Table, Pagination } from "react-bootstrap";
import { ACCESS_TOKEN } from "../constants.tsx";
import getPaginationItems from "./Pagination.tsx";

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
  age: number;
  experience: string;
  jersey: number;
};

const PlayerList = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_PLAYERLIST_URL;

  useEffect(() => {
    const fetchPlayers = async (page: number) => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        console.error("No token found");
        setError("User is not authenticated.");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the API response for debugging
        console.log("API Response:", response.data);

        // Ensure the response has the expected structure
        if (response.data && Array.isArray(response.data.Player)) {
          const allPlayers = response.data.Player;
          const playersPerPage = 50;
          setPlayers(
            allPlayers.slice(
              (page - 1) * playersPerPage,
              page * playersPerPage,
            ),
          );
          setTotalPages(Math.ceil(allPlayers.length / playersPerPage)); // Assuming 50 results per page
        } else {
          setError("Invalid API response structure.");
        }
      } catch (err) {
        const axiosError = err as AxiosError;

        if (axiosError.response) {
          console.error("Error response:", axiosError.response.data);
          console.error("Status code:", axiosError.response.status);
        } else if (axiosError.request) {
          console.error("Error request:", axiosError.request);
        } else {
          console.error("Error message:", axiosError.message);
        }
        setError("Failed to fetch player data.");
      }
    };

    fetchPlayers(currentPage);
  }, [currentPage, API_URL, ACCESS_TOKEN]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">NFL Players</h1>
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
              {players.map((player) => (
                <tr key={player.id}>
                  <td>{`${player.firstName} ${player.lastName}`}</td>
                  <td>{player.team}</td>
                  <td>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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
        </>
      )}
    </Container>
  );
};

export default PlayerList;
