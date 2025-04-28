import { useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import "../Styles/CreateLeagueForm.css"; 
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, ""); 

const CreateLeagueForm = ({ onLeagueCreated }: { onLeagueCreated: () => void }) => {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("You need to be logged in to create a league.");
      return;
    }

    try {
      
      if (isPrivate && joinCode) {
        const checkResponse = await axios.get(
          `${API_URL}/api/leagues/check_join_code/${joinCode}/`
        );
        if (checkResponse.data.exists) {
          setError("Join code already exists. Please choose a different code.");
          return;
        }
      }

     
      const draftDate = "2002-09-05T00:00:00"; 
      const timePerPick = 60; 
      const positionalBetting = true; 

      const response = await axios.post(
        `${API_URL}/api/leagues/`,
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
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 201) {
        onLeagueCreated(); 
      }
    } catch (err) {
      setError("Error creating league. Please try again.");
      console.error("Error details: ", err); 
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

      <div className="form-checkbox-group">
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