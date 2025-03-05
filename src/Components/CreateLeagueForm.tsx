import { useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const CreateLeagueForm = ({ onLeagueCreated }: { onLeagueCreated: () => void }) => {
    const [name, setName] = useState("");
    const [draftDate, setDraftDate] = useState("");
    const [timePerPick, setTimePerPick] = useState(60);
    const [positionalBetting, setPositionalBetting] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");  // Reset error on new submit

        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setError("You need to be logged in to create a league.");
            return;
        }

        try {
            // Check if the join code is unique
            if (isPrivate && joinCode) {
                const checkResponse = await axios.get(`http://localhost:8000/api/leagues/check_join_code/${joinCode}/`);
                if (checkResponse.data.exists) {
                    setError("Join code already exists. Please choose a different code.");
                    return;
                }
            }

            const response = await axios.post(
                "http://localhost:8000/api/leagues/",
                {
                    name,
                    draft_date: draftDate,
                    time_per_pick: timePerPick,
                    positional_betting: positionalBetting,
                    private: isPrivate,
                    join_code: isPrivate ? joinCode : null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Make sure the token is passed here
                    },
                }
            );

            if (response.status === 201) {
                onLeagueCreated();  // Callback after league is created
            }
        } catch (err) {
            setError("Error creating league. Please try again.");
            console.error("Error details: ", err);  // Log the error details for debugging
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-3">Create a New League</h2>
            {error && <p className="text-red-500">{error}</p>}

            <label className="block mb-2">
                League Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </label>

            <label className="block mb-2">
                Draft Date:
                <input
                    type="datetime-local"
                    value={draftDate}
                    onChange={(e) => setDraftDate(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </label>

            <label className="block mb-2">
                Time Per Pick (seconds):
                <input
                    type="number"
                    value={timePerPick}
                    onChange={(e) => setTimePerPick(Number(e.target.value))}
                    className="border p-2 w-full"
                    min="10"
                    required
                />
            </label>

            <label className="block mb-2">
                Positional Betting:
                <input
                    type="checkbox"
                    checked={positionalBetting}
                    onChange={(e) => setPositionalBetting(e.target.checked)}
                    className="ml-2"
                />
            </label>

            <label className="block mb-2">
                Private League:
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="ml-2"
                />
            </label>

            {isPrivate && (
                <label className="block mb-2">
                    Join Code:
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="border p-2 w-full"
                        maxLength={6}
                        required
                    />
                </label>
            )}

            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
            >
                Create League
            </button>
        </form>
    );
};

export default CreateLeagueForm;