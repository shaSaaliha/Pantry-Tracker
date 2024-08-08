// SearchBar.jsx
import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-4 mt-3">
      <input
        type="text"
        placeholder="Search item..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default SearchBar;