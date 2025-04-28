import React from "react";

export default function FrequencyFilter({ frequency, onFrequencyChange }) {
  return (
    <div className="frequency-filter">
      <label htmlFor="frequencyFilter">Frequency:</label>
      <div className="frequency-select">
        <select
          id="frequencyFilter"
          value={frequency}
          onChange={(e) => onFrequencyChange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
}
