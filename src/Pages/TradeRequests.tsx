import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants.tsx";
import "../Styles/TradeRequests.css";

interface TradeRequest {
    id: number;
    sender_team: {
        title: string;
        author: {
            username: string;
        };
    };
    receiver_team: {
        title: string;
    };
    sender_players: Record<string, { id: string; name: string }>;
    receiver_players: Record<string, { id: string; name: string }>;
    currency_offered: number;
    currency_requested: number;
    status: string;
    created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const TradeRequests: React.FC = () => {
    const { leagueId } = useParams<{ leagueId: string }>();
    const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
    const [leagueName, setLeagueName] = useState<string>(""); // New state for league name
    const [filteredRequests, setFilteredRequests] = useState<TradeRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("Pending");

    useEffect(() => {
        const fetchTradeRequests = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/leagues/${leagueId}/trade-requests/`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
                    }
                );
                setTradeRequests(response.data);
                filterRequests("Pending", response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch trade requests.");
            }
        };

        const fetchLeagueName = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/leagues/${leagueId}/`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
                    }
                );
                setLeagueName(response.data.name); // Set the league name
            } catch (err: any) {
                console.error("Failed to fetch league name:", err);
            }
        };

        fetchTradeRequests();
        fetchLeagueName(); // Fetch the league name
    }, [leagueId]);

    const filterRequests = (status: string, requests: TradeRequest[] = tradeRequests) => {
        if (status === "All") {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter((request) => request.status === status.toLowerCase()));
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        filterRequests(tab);
    };

    const handleResponse = async (tradeRequestId: number, response: "accept" | "reject") => {
        try {
            await axios.post(
                `${API_URL}/api/trade-request/${tradeRequestId}/respond/`,
                { response },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
                }
            );
            const updatedRequests = await axios.get(
                `${API_URL}/api/leagues/${leagueId}/trade-requests/`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
                }
            );
            setTradeRequests(updatedRequests.data);
            filterRequests(activeTab, updatedRequests.data);
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to respond to trade request.");
        }
    };

    return (
        <div className="container-fluid text-white full-page-minus-navbar">
            <div className="trade-requests-header">
                <h1>Trade Requests</h1>
                <h3>League: {leagueName}</h3> {/* Display the league name */}
            </div>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="tabs">
                {["Pending", "Accepted", "Rejected", "All"].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? "active" : ""}`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {filteredRequests.length > 0 ? (
                <div className="trade-requests-list">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="trade-request-card">
                            <h3>Trade Request</h3>
                            <p>
                                <strong>League:</strong> {leagueName} {/* Display the league name */}
                            </p>
                            <p>
                                <strong>From:</strong> {request.sender_team.author.username}
                            </p>
                            <p>
                                <strong>To:</strong> You
                            </p>
                            <p>
                                <strong>You Will Give:</strong>
                                <ul>
                                    {Object.entries(request.sender_players).map(([position, player]) => (
                                        <li key={position}>
                                            {position}: {player.name}
                                        </li>
                                    ))}
                                </ul>
                            </p>
                            <p>
                                <strong>You Will Receive:</strong>
                                <ul>
                                    {Object.entries(request.receiver_players).map(([position, player]) => (
                                        <li key={position}>
                                            {position}: {player.name}
                                        </li>
                                    ))}
                                </ul>
                            </p>
                            <p>
                                <strong>Currency Offered:</strong> ${request.currency_offered}
                            </p>
                            <p>
                                <strong>Currency Requested:</strong> ${request.currency_requested}
                            </p>
                            <p>
                                <strong>Status:</strong> {request.status}
                            </p>
                            {request.status === "pending" && (
                                <div>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={() => handleResponse(request.id, "accept")}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleResponse(request.id, "reject")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No trade requests available.</p>
            )}
        </div>
    );
};

export default TradeRequests;