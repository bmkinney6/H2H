import React, { useState } from "react";

type SearchLeagueFormProps = {
  onSearch: (query: string) => void; // Callback function to handle form submission
};

const SearchLeagueForm: React.FC<SearchLeagueFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value); // Update query state as user types
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query.trim()); // Pass query to parent component on submit
    } else {
      console.error("Please enter a league name.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container text-center">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search for leagues..."
        value={query}
        onChange={handleInputChange}
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchLeagueForm;
