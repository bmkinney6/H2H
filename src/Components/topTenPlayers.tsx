import React, { useEffect, useState } from "react";
import { fetchTopTenPlayers } from "./FetchPlayerInfo.tsx";
import "../Styles/Index.css";

type Player = {
  id: number;
  status: string;
  position: string;
  firstName: string;
  lastName: string;
  headshot: string;
  team: string;
  location: string;
  weight: number;
  displayHeight: string;
  age: number;
  experience: string;
  jersey: number;
};

const API_URL = import.meta.env.VITE_API_URL; // Replace with your actual API URL

const TopTenPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await fetchTopTenPlayers(API_URL);
        setPlayers(players);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4 overflow-hidden">
      <h1 className=" text-center sticky-top">Top 10 Players</h1>
      <div className="scrollable-cards row">
        {players.map((player) => (
          <div key={player.id} className=" top-player-card col-12 mb-4">
            <div className="card h-100">
              <img
                src={player.headshot}
                className="card-img-top rounded-circle w-75 mx-auto mt-3 h-auto"
                alt={`${player.firstName} ${player.lastName}`}
              />
              <div className="top-card-body">
                <h5 className="card-title">
                  {player.firstName} {player.lastName}
                </h5>
                <p className="card-text">{player.team}</p>
                <p className="card-text">{player.position}</p>
                <p className="card-text">
                  {player.displayHeight} - {player.weight} lbs
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTenPlayers;
