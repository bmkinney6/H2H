import React, { useState } from 'react';

interface LeagueFormProps {
  onSubmit: (formData: { name: string; owner: string; settings: string }) => void;
}

const LeagueForm: React.FC<LeagueFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [settings, setSettings] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      name,
      owner,
      settings,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="mt-4">
      <div className="form-group">
        <label htmlFor="name">League Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="owner">Owner</label>
        <input
          type="text"
          className="form-control"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="settings">Settings</label>
        <textarea
          className="form-control"
          id="settings"
          value={settings}
          onChange={(e) => setSettings(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Create League
      </button>
    </form>
  );
};

export default LeagueForm;
