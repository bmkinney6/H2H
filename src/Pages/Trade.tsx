import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants.tsx";


const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve the access token from local storage
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");
const Trade: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract leagueId from the route
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("League ID:", id); // Debug log
        console.log("Token:", token); // Debug log

        if (!id || !token) {
            console.warn("Missing leagueId or token. Skipping API call.");
            return;
        }

        const fetchTradeInfo = async () => {
            try {
                console.log("Making API request...");
                const response = await axios.get(
                    `${API_URL}/api/leagues/${id}/trade/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("API Response:", response.data);
                setData(response.data);
            } catch (err: any) {
                console.error("Error during API request:", err);
                if (err.response) {
                    setError(`Error: ${err.response.status} - ${err.response.data.error}`);
                } else if (err.request) {
                    setError('Error: No response from the server.');
                } else {
                    setError(`Error: ${err.message}`);
                }
            }
        };

        fetchTradeInfo();
    }, [id, token]); // Re-fetch data if leagueId or accessToken changes

    return (
        <div className="container">
            <h1>Trade Page</h1>

            {error && <div className="text-bg-warning">{error}</div>}

            {data ? (
                <div>
                    <h2>League: {data.league}</h2>
                    <h3>Teams:</h3>
                    <ul>
                        {data.teams.map((team: any) => (
                            <li key={team.id}>
                                <strong>{team.title}</strong> (Rank: {team.rank})
                                <ul>
                                    <li>QB: {team.QB}</li>
                                    <li>RB1: {team.RB1}</li>
                                    <li>RB2: {team.RB2}</li>
                                    <li>WR1: {team.WR1}</li>
                                    <li>WR2: {team.WR2}</li>
                                    <li>TE: {team.TE}</li>
                                    <li>FLX: {team.FLX}</li>
                                    <li>K: {team.K}</li>
                                    <li>DEF: {team.DEF}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                !error && <div>Loading...</div>
            )}
        </div>
    );
};

export default Trade;