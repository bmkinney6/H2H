import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

interface Player {
    id: string;
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
    yearly_proj: string;
}

const PlayerInfo: React.FC<{ playerId: string }> = ({ playerId }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch player information from the API
        const fetchPlayerInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/playerInfo/${playerId}`);
                setPlayer(response.data.Player);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching player info:", err);
                setError("Failed to fetch player information.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerInfo();
    }, [playerId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        player && (
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px" }}>
                <h2>
                    {player.firstName} {player.lastName} ({player.position})
                </h2>
                <img
                    src={player.headshot}
                    alt={`${player.firstName} ${player.lastName}`}
                    style={{ width: "150px", borderRadius: "50%" }}
                />
                <p>Team: {player.team}</p>
                <p>Age: {player.age}</p>
                <p>Height: {player.displayHeight}</p>
                <p>Weight: {player.weight} lbs</p>
                <p>Jersey Number: #{player.jersey}</p>
                <p>Experience: {player.experience}</p>
                <p>Yearly Projection: {player.yearly_proj} points</p>
                <p>Status: {player.status}</p>
            </div>
        )
    );
};

export default PlayerInfo;