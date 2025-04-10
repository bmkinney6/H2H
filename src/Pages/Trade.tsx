import { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from "../constants.tsx";

type User = {
    username: string;
};

type Team = {
    id: number;
    title: string;
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
};

type TradePageProps = {
    leagueId: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const TradePage = ({ leagueId }: TradePageProps) => {
    const [userTeam, setUserTeam] = useState<Team | null>(null);
    const [otherTeams, setOtherTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTradeData = async () => {
            setLoading(true);
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setError('User is not authenticated.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/leagues/59/trade/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserTeam(response.data.user_team);
                setOtherTeams(response.data.other_teams);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError('There was an issue loading the trade data.');
                setLoading(false);
            }
        };

        fetchTradeData();
    }, [leagueId]);

    const handleTeamSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeamId(event.target.value);
    };

    const selectedTeam = otherTeams.find((team) => team.id === Number(selectedTeamId));

    return (
        <div className="container">
            <h1>Trade Page</h1>
            {loading && <p>Loading data...</p>}
            {error && <p className="error">{error}</p>}

            <div>
                <h2>Your Team:</h2>
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
                    <p>Loading your team...</p>
                )}
            </div>

            <div>
                <h2>Select a Team to Trade With:</h2>
                <select onChange={handleTeamSelect} value={selectedTeamId}>
                    <option value="">Select a team</option>
                    {otherTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTeam && (
                <div>
                    <h3>Selected Team: {selectedTeam.title}</h3>
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
                    {/* Add the ability to start the trade here */}
                </div>
            )}
        </div>
    );
};

export default TradePage;
