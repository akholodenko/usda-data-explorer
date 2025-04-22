import React from "react";
import "../styles/LastDaysFilter.css";

const LastDaysFilter = ({
  lastDays,
  onLastDaysChange,
  options = [
    { value: 30, label: "Last 30 Days" },
    { value: 60, label: "Last 60 Days" },
    { value: 90, label: "Last 90 Days" },
    { value: 180, label: "Last 180 Days" },
    { value: 365, label: "Last 365 Days" },
  ],
}) => {
  return (
    <div className="last-days-filter">
      <select
        className="last-days-select"
        value={lastDays}
        onChange={(e) => onLastDaysChange(Number(e.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LastDaysFilter;
