import React, { useState } from "react";

type SearchFormProps = {
  onSubmit: (name: string) => void;
  placeholder: string;
};

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="form-container text-center ">
      <input
        type="text"
        className="form-control mb-3"
        placeholder={placeholder} // Use the passed-in placeholder
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
