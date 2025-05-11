import React, { useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/roadmap/${encodeURIComponent(searchQuery.toLowerCase())}`);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        
        <div className="search-input-container">
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to learn? (e.g., React, Python, UX Design)"
            className="sach-input"
          />
        </div>
        <button type="submit" className="search-button">
          Learn
        </button>
      </form>
    </div>
  );
};

export default SearchBar;