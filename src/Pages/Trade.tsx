import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants.tsx";

interface Team {
    id: number;
    title: string;
    rank: number;
    QB: string;
    RB1: string;
    RB2: string;
    WR1: string;
    WR2: string;
    TE: string;
    FLX: string;
    K: string;
    DEF: string;
    BN1: string;
    BN2: string;
    BN3: string;
    BN4: string;
    BN5: string;
    BN6: string;
    IR1: string;
    IR2: string;
    author: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    [key: string]: string | number | object;
}

interface LeagueData {
    league: string;
    teams: Team[];
}

const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve the access token from local storage
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Trade: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract leagueId from the route
    const [data, setData] = useState<LeagueData | null>(null); // Use LeagueData type
    const [error, setError] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null); // State for selected team
    const [userTeam, setUserTeam] = useState<Team | null>(null); // State for the user's team

    const userId = 8; // Replace this with the logged-in user's ID (retrieved from context, auth, etc.)

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

                // Find the user's team
                const userTeam = response.data.teams.find(
                    (team: Team) => team.author.id === userId
                );

                setUserTeam(userTeam);
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

    // Handle dropdown change
    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeamId(Number(e.target.value)); // Convert the value to a number
    };

    // Filter teams to exclude the user's team
    const otherTeams = data?.teams.filter((team: Team) => team.author.id !== userId);

    // Find the selected team
    const selectedTeam = otherTeams?.find((team: Team) => team.id === selectedTeamId);

    return (
        <div className="container text-white">
            <h1>Trade Page</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {data ? (
                <div className="row">
                    {/* User's Team Section */}
                    <div className="col-md-6">
                        <h2>My Team: {userTeam?.title} (Rank: {userTeam?.rank})</h2>
                        {userTeam ? (
                            <ul>
                                <li>QB: {userTeam.QB}</li>
                                <li>RB1: {userTeam.RB1}</li>
                                <li>RB2: {userTeam.RB2}</li>
                                <li>WR1: {userTeam.WR1}</li>
                                <li>WR2: {userTeam.WR2}</li>
                                <li>TE: {userTeam.TE}</li>
                                <li>FLX: {userTeam.FLX}</li>
                                <li>K: {userTeam.K}</li>
                                <li>DEF: {userTeam.DEF}</li>
                                <li>BN1: {userTeam.BN1}</li>
                                <li>BN2: {userTeam.BN2}</li>
                                <li>BN3: {userTeam.BN3}</li>
                                <li>BN4: {userTeam.BN4}</li>
                                <li>BN5: {userTeam.BN5}</li>
                                <li>BN6: {userTeam.BN6}</li>
                                <li>IR1: {userTeam.IR1}</li>
                                <li>IR2: {userTeam.IR2}</li>
                            </ul>
                        ) : (
                            <p>No team found for the user.</p>
                        )}
                    </div>

                    {/* Dropdown and Selected Team Section */}
                    <div className="col-md-6">
                        <h2>League: {data.league}</h2>
                        <h3>Select a Team:</h3>
                        <select
                            className="form-select"
                            onChange={handleTeamChange}
                            value={selectedTeamId || ''}
                        >
                            <option value="" disabled>Select a team</option>
                            {otherTeams?.map((team: Team) => (
                                <option key={team.id} value={team.id}>
                                    {team.title} (Rank: {team.rank})
                                </option>
                            ))}
                        </select>
                        {/* Display selected team details */}
                        {selectedTeam && (
                            <div className="mt-4">
                                <h4>Team: {selectedTeam.title} (Rank: {selectedTeam.rank})</h4>
                                <ul>
                                    <li>QB: {selectedTeam.QB}</li>
                                    <li>RB1: {selectedTeam.RB1}</li>
                                    <li>RB2: {selectedTeam.RB2}</li>
                                    <li>WR1: {selectedTeam.WR1}</li>
                                    <li>WR2: {selectedTeam.WR2}</li>
                                    <li>TE: {selectedTeam.TE}</li>
                                    <li>FLX: {selectedTeam.FLX}</li>
                                    <li>K: {selectedTeam.K}</li>
                                    <li>DEF: {selectedTeam.DEF}</li>
                                    <li>BN1: {selectedTeam.BN1}</li>
                                    <li>BN2: {selectedTeam.BN2}</li>
                                    <li>BN3: {selectedTeam.BN3}</li>
                                    <li>BN4: {selectedTeam.BN4}</li>
                                    <li>BN5: {selectedTeam.BN5}</li>
                                    <li>BN6: {selectedTeam.BN6}</li>
                                    <li>IR1: {selectedTeam.IR1}</li>
                                    <li>IR2: {selectedTeam.IR2}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                !error && <div>Loading...</div>
            )}
        </div>
    );
};

export default Trade;