import React, { useState } from "react";
import CommodityFilter from "./CommodityFilter";
import LastDaysFilter from "./LastDaysFilter";
import Chart from "./Chart";
// import Chart from './Chart'; // Uncomment if you want to use the Chart
import "../styles/ReportDetails.css";

export default function ReportDetails({
  report,
  reportData,
  commodities,
  commodityFilter,
  onCommodityFilter,
  lastDays = 90, // Default to 90 days
  onLastDaysChange,
  isLoading,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  if (!report) {
    return <div className="report-info">Select a report to view details.</div>;
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading report data...</p>
      </div>
    );
  }

  if (!reportData) {
    return <div className="report-info">No report data available.</div>;
  }

  // The report details are in data[1].results
  const results = reportData[1]?.results || [];
  const filteredResults = commodityFilter
    ? results.filter((r) => r.commodity === commodityFilter)
    : results;

  // If a row is selected, filter all results for that commodity/variety/item_size/organic
  let chartData = null;
  if (selectedRow) {
    chartData = results.filter(
      (r) =>
        r.commodity === selectedRow.commodity &&
        r.var === selectedRow.var &&
        r.item_size === selectedRow.item_size &&
        r.organic === selectedRow.organic
    );
    // Sort by report_date ascending
    chartData.sort((a, b) => new Date(a.report_date) - new Date(b.report_date));
  }

  return (
    <div>
      <div className="report-header">
        <h2 id="commodityName">
          {report?.report_title ? `${report.report_title}` : "Report Details"}
        </h2>
        <div className="filters">
          <CommodityFilter
            commodities={commodities}
            value={commodityFilter}
            onChange={onCommodityFilter}
          />
          <LastDaysFilter
            lastDays={lastDays}
            onLastDaysChange={onLastDaysChange}
          />
        </div>
      </div>
      {selectedRow && chartData && chartData.length > 0 && (
        <div className="chart-container">
          <h3>
            {selectedRow.commodity}{" "}
            {selectedRow.var ? `- ${selectedRow.var}` : ""} Price History
          </h3>
          <Chart data={chartData} />
        </div>
      )}
      <div className="stats">
        {filteredResults.length === 0 ? (
          <div>No report details available.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Commodity</th>
                <th>Variety</th>
                <th>High Price</th>
                <th>Low Price</th>
                <th>Item Size</th>
                <th>Organic</th>
                <th>Package</th>
                <th>Report Date</th>
                <th>Season</th>
                <th>Market Tone</th>
                <th>Demand Tone</th>
                <th>Supply Tone</th>
                <th>Rep Cmt</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    cursor: "pointer",
                    background:
                      selectedRow &&
                      row.commodity === selectedRow.commodity &&
                      row.var === selectedRow.var &&
                      row.item_size === selectedRow.item_size &&
                      row.organic === selectedRow.organic
                        ? "#e3f2fd"
                        : undefined,
                  }}
                  onClick={() => setSelectedRow(row)}
                >
                  <td>{row.grp || "-"}</td>
                  <td>{row.commodity || "-"}</td>
                  <td>{row.var || "-"}</td>
                  <td>{row.high_price || "-"}</td>
                  <td>{row.low_price || "-"}</td>
                  <td>{row.item_size || "-"}</td>
                  <td>{row.organic || "-"}</td>
                  <td>{row.pkg || "-"}</td>
                  <td>{row.report_date || "-"}</td>
                  <td>{row.season || "-"}</td>
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
                      {row.rep_cmt ? (
                        <>
                          <span className="rep-cmt-text">{row.rep_cmt}</span>
                          <div className="rep-cmt-tooltip">{row.rep_cmt}</div>
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
        )}
      </div>
    </div>
  );
}
