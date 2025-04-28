import React from "react";

export default function GroupFilter({ groups, selectedGroup, onGroupChange }) {
  return (
    <div className="group-filter">
      <label htmlFor="groupFilter">Filter by Group:</label>
      <select
        id="groupFilter"
        value={selectedGroup}
        onChange={(e) => onGroupChange(e.target.value)}
      >
        <option value="">All Groups</option>
        {groups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>
  );
}
