import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
console.log(query);

    // redirect to search results page with query
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm w-full max-w-sm">
      <input
        type="text"
        placeholder="Search books..."
        className="w-full bg-transparent outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <FaSearch
        className="text-gray-500 cursor-pointer"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
