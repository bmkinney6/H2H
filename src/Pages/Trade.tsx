import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants.tsx";
import { jwtDecode } from "jwt-decode";
import "../Styles/Trade.css";

interface Player {
id: string;
firstName: string;
lastName: string;
}

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
    author: {
        id: number;
        profile: {
            currency: string;
        };
    };
    [key: string]: string | number | object;
}

interface LeagueData {
    league: number;
    teams: Team[];
}

const token = localStorage.getItem(ACCESS_TOKEN);
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

let userId: number | null = null;

if (token) {
    const decodedToken: { user_id: number } = jwtDecode(token);
    userId = decodedToken.user_id;
}

// Trade component to handle trade requests
const Trade: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<LeagueData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [userTeam, setUserTeam] = useState<Team | null>(null);
    const [selectedUserPlayer, setSelectedUserPlayer] = useState<{ position: string; id: string } | null>(null);
    const [selectedOpponentPlayer, setSelectedOpponentPlayer] = useState<{ position: string; id: string } | null>(null);
    const [currencyOffered, setCurrencyOffered] = useState<number>(0);
    const [currencyRequested, setCurrencyRequested] = useState<number>(0);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!id || !token) return;

        const fetchTradeInfo = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/leagues/${id}/trade/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const userTeam = response.data.teams.find(
                    (team: Team) => team.author.id === userId
                );
                setUserTeam(userTeam);
                setData(response.data);

                // Fetch player names using the new batch endpoint, create array of player IDs
                const playerIds = new Set<string>();
                response.data.teams.forEach((team: Team) => {
                    Object.values(team).forEach((value) => {
                        if (typeof value === "string" && value !== "N/A") {
                            playerIds.add(value);
                        }
                    });
                });

                const playerResponse = await axios.get(
                    `${API_URL}/api/player/batch-info/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { "ids[]": Array.from(playerIds) }, // Pass player IDs as query params
                    }
                );
                // Map player IDs to names
                const names = playerResponse.data.Players.reduce(
                    (acc: Record<string, string>, player: Player) => {
                        acc[player.id] = `${player.firstName} ${player.lastName}`;
                        return acc;
                    },
                    {}
                );
                setPlayerNames(names); // Store player names in state
            } catch (err: any) {
                console.error("Error fetching trade info:", err); // Log the error
                setError(err.response?.data?.error || "Failed to fetch trade info.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTradeInfo();
    }, [id, token]);

    const handlePlayerSelection = (playerId: string, position: string, isUserTeam: boolean) => {
        if (isUserTeam) {
            setSelectedUserPlayer((prev) =>
                prev?.id === playerId ? null : { position, id: playerId }
            );
        } else {
            setSelectedOpponentPlayer((prev) =>
                prev?.id === playerId ? null : { position, id: playerId }
            );
        }
        setValidationError(null);
    };

    const renderTeamPlayers = (team: Team, isUserTeam: boolean) => {
        const positions = [
            "QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLX", "K", "DEF",
            "BN1", "BN2", "BN3", "BN4", "BN5", "BN6"
        ];

        const selectedPlayer = isUserTeam ? selectedUserPlayer : selectedOpponentPlayer;

        return (
            <ul className="player-list">
                {positions.map((position) => {
                    const playerId = team[position];
                    if (!playerId || playerId === "N/A") return null;

                    const isSelected = selectedPlayer?.id === playerId;
                    return (
                        <li
                            key={position}
                            className={`player-item ${isSelected ? "selected" : ""}`}
                            onClick={() => handlePlayerSelection(playerId, position, isUserTeam)}
                        >
                            {position}: {playerNames[playerId] || playerId}
                        </li>
                    );
                })}
            </ul>
        );
    };

    const handleSubmitTrade = async () => {
        if (!selectedTeamId || !userTeam || !selectedUserPlayer || !selectedOpponentPlayer) {
            setValidationError("Please select a team and players for the trade.");
            return;
        }

        const senderPlayers = { [selectedUserPlayer.position]: selectedUserPlayer.id };
        const receiverPlayers = { [selectedOpponentPlayer.position]: selectedOpponentPlayer.id };

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/leagues/${id}/trade-request/`,
                {
                    receiver_team_id: selectedTeamId,
                    sender_players: senderPlayers,
                    receiver_players: receiverPlayers,
                    currency_offered: currencyOffered,
                    currency_requested: currencyRequested,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setValidationError(null);
            alert("Trade request sent successfully!");
        } catch (err: any) {
            setValidationError(err.response?.data?.error || "Failed to send trade request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid text-white full-page-minus-navbar">
            {error && <div className="alert alert-danger">{error}</div>}

            {data ? (
                <>
                    <div className="w-100 text-center position-absolute top-0 mt-4">
                        <h1>Make a trade within {data.league}!</h1>
                    </div>

                    <div className="trade-layout">
                        <div className="userTeam">
                            <h2>Your Team: {userTeam?.title} (Rank: {userTeam?.rank})</h2>
                            <p>Available Currency: ${userTeam?.author.profile.currency}</p>
                            {userTeam ? renderTeamPlayers(userTeam, true) : <p>No team found.</p>}
                        </div>

                        <div className="divider trade-divider d-flex flex-column align-items-center">
                            <label>
                                Currency Offered:
                                <input
                                    type="number"
                                    className="form-control"
                                    value={currencyOffered}
                                    onChange={(e) => setCurrencyOffered(Number(e.target.value))}
                                    min="0"
                                    max={parseFloat(userTeam?.author.profile.currency || "0")}
                                />
                            </label>
                            <label>
                                Currency Requested:
                                <input
                                    type="number"
                                    className="form-control"
                                    value={currencyRequested}
                                    onChange={(e) => setCurrencyRequested(Number(e.target.value))}
                                    min="0"
                                    max={parseFloat(data.teams.find((t) => t.id === selectedTeamId)?.author.profile.currency || "0")}
                                />
                            </label>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmitTrade}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Send Trade Request"}
                            </button>
                            {validationError && <p className="text-danger mt-2">{validationError}</p>}
                        </div>

                        <div>
                            <h2>Select Opponent Team:</h2>
                            <select
                                className="form-select w-auto select-dropdown"
                                onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                                value={selectedTeamId || ""}
                            >
                                <option value="" disabled>Select a team</option>
                                {data.teams
                                    .filter((team) => team.author.id !== userId) // Exclude the user's own team
                                    .map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.title} (Rank: {team.rank})
                                        </option>
                                    ))}
                            </select>

                            {selectedTeamId && (
                                <div className="mt-2">
                                    <h2>Opponent Team: {data.teams.find((t) => t.id === selectedTeamId)?.title}</h2>
                                    {renderTeamPlayers(data.teams.find((t) => t.id === selectedTeamId)!, false)}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div>No data available.</div>
            )}
        </div>
    );
};

export default Trade;