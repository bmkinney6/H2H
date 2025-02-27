import React, { useEffect, useState } from "react";

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  team: string;
  position: string;
  jersey: number;
  age: number;
  headshot: string;
  weight: number;
  displayHeight: string;
}

interface PlayerCardProps {
  playerId: number;
}

const TopTenPlayerCard: React.FC<PlayerCardProps> = ({ playerId }) => {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // Mock fetch function to simulate fetching player data
    const fetchPlayer = (id: number): Player => {
      // Replace this with actual data fetching logic
      const playerData = {
        id: id,
        firstName: "John",
        lastName: "Doe",
        team: "Eagles",
        position: "Quarterback",
        jersey: 12,
        age: 28,
        headshot: "path/to/headshot.jpg",
        weight: 220,
        displayHeight: "6ft 2in",
      };
      return playerData;
    };

    const playerData = fetchPlayer(playerId);
    setPlayer(playerData);
  }, [playerId]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="player-card">
      <img
        src={player.headshot}
        alt={`${player.firstName} ${player.lastName}`}
      />
      <h2>
        {player.firstName} {player.lastName}
      </h2>
      <p>Team: {player.team}</p>
      <p>Position: {player.position}</p>
      <p>Jersey Number: {player.jersey}</p>
      <p>Age: {player.age}</p>
      <p>Weight: {player.weight} lbs</p>
      <p>Height: {player.displayHeight}</p>
    </div>
  );
};

export default TopTenPlayerCard;
