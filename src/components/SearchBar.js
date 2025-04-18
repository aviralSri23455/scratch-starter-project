import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="w-full mb-2 flex items-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search blocks..."
        className="w-full px-2 py-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;