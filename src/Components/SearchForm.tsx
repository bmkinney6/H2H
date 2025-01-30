import React, { useState } from "react";


// Define the type for the SearchForm props
type SearchFormProps = {
  onSubmit: (playerId: string) => void; // Callback function to handle form submission
  placeholder: string; // Placeholder text for the input field
};

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, placeholder }) => {
  const [playerId, setPlayerId] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(event.target.value); // Update the playerId state as the user types
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (playerId) {
      onSubmit(playerId); // Pass the playerId to the parent component on form submit
    } else {
      console.error("Please enter a player ID.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container text-center ">
      <input
        type="text"
        className="form-control mb-3"
        placeholder={placeholder} // Use the passed-in placeholder
        value={playerId}
        onChange={handleInputChange}
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
