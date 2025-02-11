import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Components/AuthContext"; // Ensure correct path

const CreateLeagueForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [leagueData, setLeagueData] = useState({
    name: "",
    owner: "", // Initially set to an empty string
  });

  useEffect(() => {
    if (user) {
      setLeagueData((prevData) => ({ ...prevData, owner: user }));
    }
  }, [user]); // Re-run effect when `user` changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueData.owner) {
      console.log("Owner is not set.");
      return; // Handle the case where owner is not set
    }
    console.log("League Created:", leagueData);
  };

  return (
    <div>
      <h2>Create a New League</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>League Name</label>
          <input
            type="text"
            name="name"
            value={leagueData.name}
            onChange={(e) =>
              setLeagueData({ ...leagueData, name: e.target.value })
            }
          />
        </div>

        <button type="submit">Create League</button>
      </form>
    </div>
  );
};

export default CreateLeagueForm;
