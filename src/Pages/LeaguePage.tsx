import React, { useState } from 'react';
import axios from 'axios';
import LeagueForm from '../Components/LeagueForm';

interface League {
  id: string;
  name: string;
  owner: string;
  settings: string;
}

const LeaguePage: React.FC = () => {
  const [leagueCreated, setLeagueCreated] = useState<League | null>(null);

  const handleSubmit = async (formData: { name: string; owner: string; settings: string }) => {
    try {
      const response = await axios.post('/api/leagues/', formData);
      setLeagueCreated(response.data);
    } catch (error) {
      console.error('Error creating league', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New League</h2>
      <LeagueForm onSubmit={handleSubmit} />
      {leagueCreated && <div className="alert alert-success mt-3">League {leagueCreated.name} created successfully!</div>}
    </div>
  );
};

export default LeaguePage;
