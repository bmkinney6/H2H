import { useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import "../Styles/CreateLeagueForm.css"; // Import the CSS file for styling

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
    setError(""); // Reset error on new submit

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You need to be logged in to create a league.");
      return;
    }

    try {
      // Check if the join code is unique
      if (isPrivate && joinCode) {
        const checkResponse = await axios.get(
          `http://localhost:8000/api/leagues/check_join_code/${joinCode}/`
        );
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
            Authorization: `Bearer ${token}`, // Make sure the token is passed here
          },
        }
      );

      if (response.status === 201) {
        onLeagueCreated(); // Callback after league is created
      }
    } catch (err) {
      setError("Error creating league. Please try again.");
      console.error("Error details: ", err); // Log the error details for debugging
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-league-form">
      {error && <p className="form-error">{error}</p>}

      <label className="form-label">
        League Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Draft Date:
        <input
          type="datetime-local"
          value={draftDate}
          onChange={(e) => setDraftDate(e.target.value)}
          className="form-input"
          required
        />
      </label>

      <label className="form-label">
        Time Per Pick (seconds):
        <input
          type="number"
          value={timePerPick}
          onChange={(e) => setTimePerPick(Number(e.target.value))}
          className="form-input"
          min="10"
          required
        />
      </label>

      <div className="form-checkbox-group">
        <label className="form-checkbox-label">
          Positional Betting:
          <input
            type="checkbox"
            checked={positionalBetting}
            onChange={(e) => setPositionalBetting(e.target.checked)}
            className="form-checkbox"
          />
        </label>

        <label className="form-checkbox-label">
          Private League:
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="form-checkbox"
          />
        </label>
      </div>

      {isPrivate && (
        <label className="form-label">
          Join Code:
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="form-input"
            maxLength={6}
            required
          />
        </label>
      )}

      <button type="submit" className="form-submit-button">
        Create League
      </button>
    </form>
  );
};

export default CreateLeagueForm;