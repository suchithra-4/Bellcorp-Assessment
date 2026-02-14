import React, { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    // Handle filter changes
    const handleFilterChange = () => {
        onFilter({
            category,
            location,
            startDate,
            endDate
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setCategory('');
        setLocation('');
        setStartDate('');
        setEndDate('');
        onSearch('');
        onFilter({
            category: '',
            location: '',
            startDate: '',
            endDate: ''
        });
    };

    return (
        <div className="search-filter">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search events by name, description, or organizer..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            <div className="filter-box">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Sports">Sports</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                </select>

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="filter-input"
                />

                <input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="filter-input"
                />

                <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="filter-input"
                />

                <button onClick={handleFilterChange} className="filter-button">
                    Apply Filters
                </button>

                <button onClick={clearFilters} className="clear-button">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
