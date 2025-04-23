import React from "react";

const FrequencyFilter = ({ frequency, onFrequencyChange }) => {
  return (
    <div className="frequency-filter">
      <label>Frequency:</label>
      <select
        value={frequency}
        onChange={(e) => onFrequencyChange(e.target.value)}
        className="filter-select"
      >
        <option value="weekly">Weekly</option>
        <option value="daily">Daily</option>
      </select>
    </div>
  );
};

export default FrequencyFilter;
