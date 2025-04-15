import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Search for a report..."
        value={searchTerm}
        onChange={handleInput}
      />
      <button onClick={() => onSearch(searchTerm)}>Search</button>
    </div>
  );
}
