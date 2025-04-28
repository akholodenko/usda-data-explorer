import React, { useState, useRef, useEffect } from "react";

export default function CommodityFilter({ commodities, value, onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const filteredCommodities = commodities.filter((c) =>
    c.commodity_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (commodity) => {
    onChange(commodity);
    setSearchTerm(commodity);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCommodities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredCommodities[highlightedIndex].commodity_name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="commodity-filter" ref={wrapperRef}>
      <label htmlFor="commodityFilter">Filter by Commodity:</label>
      <div className="typeahead-container">
        <input
          type="text"
          id="commodityFilter"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search commodities..."
          className="typeahead-input"
        />
        {isOpen && filteredCommodities.length > 0 && (
          <ul className="typeahead-dropdown">
            {filteredCommodities.map((c, index) => (
              <li
                key={c.commodity_lov_id}
                className={`typeahead-item ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={() => handleSelect(c.commodity_name)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {c.commodity_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
