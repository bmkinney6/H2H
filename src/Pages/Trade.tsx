import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants.tsx";
import { jwtDecode } from "jwt-decode";
import "../Styles/Trade.css";

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
        profile: {
            currency: string; // Currency is stored as a string
        };
    };
    [key: string]: string | number | object;
}

interface LeagueData {
    league: string;
    teams: Team[];
}

const token = localStorage.getItem(ACCESS_TOKEN);
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

let userId: number | null = null;

if (token) {
    const decodedToken: { user_id: number } = jwtDecode(token);
    userId = decodedToken.user_id;
}

const Trade: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<LeagueData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [userTeam, setUserTeam] = useState<Team | null>(null);
    const [selectedUserPlayers, setSelectedUserPlayers] = useState<Record<string, string[]>>({});
    const [selectedOpponentPlayers, setSelectedOpponentPlayers] = useState<Record<string, string[]>>({});
    const [currencyOffered, setCurrencyOffered] = useState<number>(0);
    const [currencyRequested, setCurrencyRequested] = useState<number>(0);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
            } catch (err: any) {
                if (err.response) {
                    setError(`Error: ${err.response.status} - ${err.response.data.error}`);
                } else if (err.request) {
                    setError('Error: No response from the server.');
                } else {
                    setError(`Error: ${err.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTradeInfo();
    }, [id, token]);

    const handlePlayerSelection = (player: string, position: string, isUserTeam: boolean) => {
        const updateSelection = (prev: Record<string, string[]>) => {
            const newSelection = { ...prev };

            if (!newSelection[position]) {
                newSelection[position] = [];
            }

            if (newSelection[position].includes(player)) {
                newSelection[position] = newSelection[position].filter((p) => p !== player);
            } else {
                newSelection[position].push(player);
            }

            if (newSelection[position].length === 0) {
                delete newSelection[position];
            }

            return newSelection;
        };

        if (isUserTeam) {
            setSelectedUserPlayers((prev) => updateSelection(prev));
        } else {
            setSelectedOpponentPlayers((prev) => updateSelection(prev));
        }

        setValidationError(null);
    };

    const validateTrade = (): boolean => {
        if (!selectedTeamId) {
            setValidationError('Please select a team to trade with.');
            return false;
        }

        if (currencyOffered < 0 || currencyRequested < 0) {
            setValidationError('Currency values cannot be negative.');
            return false;
        }

        // Validate user's currency
        const userCurrency = parseFloat(userTeam?.author.profile.currency || "0");
        if (userCurrency < currencyOffered) {
            setValidationError('You do not have enough currency to offer.');
            return false;
        }

        // Validate opponent's currency
        const opponentCurrency = parseFloat(selectedTeam?.author.profile.currency || "0");
        if (opponentCurrency < currencyRequested) {
            setValidationError('Opponent does not have enough currency to fulfill your request.');
            return false;
        }

        const userPositions = Object.keys(selectedUserPlayers);
        const opponentPositions = Object.keys(selectedOpponentPlayers);

        if (userPositions.length !== opponentPositions.length) {
            setValidationError('The number of positions selected must match on both sides.');
            return false;
        }

        for (const position of userPositions) {
            if (
                !opponentPositions.includes(position) ||
                selectedUserPlayers[position].length !== selectedOpponentPlayers[position]?.length
            ) {
                setValidationError(`Mismatch in selected players for position: ${position}.`);
                return false;
            }
        }

        return true;
    };

    const handleTrade = async () => {
        if (!validateTrade()) {
            return;
        }

        const payload = {
            userPlayers: selectedUserPlayers,
            opponentPlayers: selectedOpponentPlayers,
            opponentTeamId: selectedTeamId,
            currencyOffered,
            currencyRequested,
        };

        setIsSubmitting(true);
        console.log('Trade payload:', payload);
        try {
            await axios.post(
                `${API_URL}/api/leagues/${id}/trade/execute/`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('Trade completed successfully!');
            setSelectedUserPlayers({});
            setSelectedOpponentPlayers({});
            setCurrencyOffered(0);
            setCurrencyRequested(0);
            setSelectedTeamId(null);
        } catch (err: any) {
            if (err.response && err.response.data.error) {
                setValidationError(err.response.data.error);
            } else {
                setValidationError('Failed to complete the trade. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const otherTeams = data?.teams.filter((team: Team) => team.author.id !== userId);
    const selectedTeam = otherTeams?.find((team: Team) => team.id === selectedTeamId);

    const renderTeamPlayers = (team: Team, isUserTeam: boolean) => {
        const players = [
            'QB', 'RB1', 'RB2', 'WR1', 'WR2',
            'TE', 'FLX', 'K', 'DEF',
            'BN1', 'BN2', 'BN3', 'BN4', 'BN5', 'BN6',
            'IR1', 'IR2',
        ];
        const selectedPlayers = isUserTeam ? selectedUserPlayers : selectedOpponentPlayers;

        return (
            <ul>
                {players.map((position) => (
                    <li key={position}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedPlayers[position]?.includes(team[position]) || false}
                                onChange={() =>
                                    handlePlayerSelection(team[position], position, isUserTeam)
                                }
                                disabled={!team[position]}
                            />
                            {position}: {team[position]}
                        </label>
                    </li>
                ))}
            </ul>
        );
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
                            <h2>My Team: {userTeam?.title} (Rank: {userTeam?.rank})</h2>
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
                                    max={parseFloat(selectedTeam?.author.profile.currency || "0")}
                                />
                            </label>
                            <button
                                className="btn btn-primary"
                                onClick={handleTrade}
                                disabled={
                                    Object.keys(selectedUserPlayers).length === 0 ||
                                    Object.keys(selectedOpponentPlayers).length === 0 ||
                                    isSubmitting
                                }
                            >
                                {isSubmitting ? 'Submitting...' : 'Execute Trade'}
                            </button>
                            <div className="validation-message">
                                {validationError && <span>{validationError}</span>}
                            </div>
                        </div>

                        <div>
                            <h2>Select a Team:</h2>
                            <select
                                className="form-select w-auto"
                                onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                                value={selectedTeamId || ''}
                            >
                                <option value="" disabled>Select a team</option>
                                {otherTeams?.map((team: Team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.title} (Rank: {team.rank})
                                    </option>
                                ))}
                            </select>

                            {selectedTeam && (
                                <div className="mt-2">
                                    <h2>Team: {selectedTeam.title} (Rank: {selectedTeam.rank})</h2>
                                    <p>Opponent's Currency: ${selectedTeam.author.profile.currency}</p>
                                    {renderTeamPlayers(selectedTeam, false)}
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