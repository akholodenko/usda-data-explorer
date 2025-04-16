import React from "react";

export default function LastDaysFilter({ lastDays, onLastDaysChange }) {
  const options = [
    { value: 30, label: "Last 30 Days" },
    { value: 60, label: "Last 60 Days" },
    { value: 90, label: "Last 90 Days" },
    { value: 180, label: "Last 180 Days" },
    { value: 365, label: "Last 365 Days" },
  ];

  return (
    <div className="last-days-filter">
      <label htmlFor="lastDays">Time Range:</label>
      <select
        id="lastDays"
        value={lastDays}
        onChange={(e) => onLastDaysChange(Number(e.target.value))}
        className="last-days-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
