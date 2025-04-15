import React from "react";

export default function CommodityFilter({ commodities, value, onChange }) {
  return (
    <div className="commodity-filter">
      <label htmlFor="commodityFilter">Filter by Commodity:</label>
      <select
        id="commodityFilter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Commodities</option>
        {commodities.map((c) => (
          <option key={c.commodity_lov_id} value={c.commodity_name}>
            {c.commodity_name}
          </option>
        ))}
      </select>
    </div>
  );
}
