import React, { useState } from "react";

// Helper function for getting unique varieties
const getUniqueVarieties = (rows) => {
  return rows
    .map((row) => row.variety)
    .filter((v) => v && v !== "-" && v !== "N/A" && v.trim() !== "")
    .filter((v, i, self) => self.indexOf(v) === i);
};

const CommoditySection = ({
  commodity,
  rows,
  selectedRow,
  onRowClick,
  selectedVarieties,
  handleVarietyClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div key={commodity} className="commodity-group">
      <div
        className="commodity-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div className="header-content">
          <span className={`chevron ${isExpanded ? "expanded" : ""}`}>▶</span>
          <div>
            {commodity}&nbsp;
            {rows[0]?.group && (
              <span className="commodity-group-label">({rows[0].group})</span>
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <>
          <div className="variety-filter">
            {getUniqueVarieties(rows).map((variety) => (
              <button
                key={variety}
                className={`variety-button ${
                  selectedVarieties[commodity] === variety ? "active" : ""
                }`}
                onClick={() => handleVarietyClick(commodity, variety)}
              >
                {variety}
              </button>
            ))}
            {selectedVarieties[commodity] && (
              <button
                className="variety-button clear"
                onClick={() => handleVarietyClick(commodity, null)}
              >
                Clear Filter
              </button>
            )}
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Variety</th>
                <th>Location</th>
                <th>High Price</th>
                <th>Low Price</th>
                <th>Item Size</th>
                <th>Package</th>
                <th>Report Date</th>
                <th>Quality</th>
                <th>Organic</th>
                <th>Market Tone</th>
                <th>Demand Tone</th>
                <th>Supply Tone</th>
                <th>Commodity Comments</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter(
                  (row) =>
                    !selectedVarieties[commodity] ||
                    row.variety === selectedVarieties[commodity]
                )
                .map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick(row)}
                    style={{
                      cursor: "pointer",
                      background:
                        selectedRow &&
                        row.commodity === selectedRow.commodity &&
                        row.variety === selectedRow.variety &&
                        row.item_size === selectedRow.item_size &&
                        row.organic === selectedRow.organic
                          ? "#e3f2fd"
                          : undefined,
                    }}
                  >
                    <td>{row.variety || "-"}</td>
                    <td>{row.location || "-"}</td>
                    <td>{row.high_price || "-"}</td>
                    <td>{row.low_price || "-"}</td>
                    <td>{row.item_size || "-"}</td>
                    <td>{row.package || "-"}</td>
                    <td>{row.report_date || "-"}</td>
                    <td>{row.quality || "-"}</td>
                    <td>{row.organic || "-"}</td>
                    <td>
                      <div className="rep-cmt-cell">
                        {row.market_tone_comments ? (
                          <>
                            <span className="rep-cmt-text">
                              {row.market_tone_comments}
                            </span>
                            <div className="rep-cmt-tooltip">
                              {row.market_tone_comments}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                    <td>{row.demand_tone_comments || "-"}</td>
                    <td>{row.supply_tone_comments || "-"}</td>
                    <td>
                      <div className="rep-cmt-cell">
                        {row.commodity_comments ? (
                          <>
                            <span className="rep-cmt-text">
                              {row.commodity_comments}
                            </span>
                            <div className="rep-cmt-tooltip">
                              {row.commodity_comments}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="rep-cmt-cell">
                        {row.comment ? (
                          <>
                            <span className="rep-cmt-text">{row.comment}</span>
                            <div className="rep-cmt-tooltip">{row.comment}</div>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CommoditySection;
