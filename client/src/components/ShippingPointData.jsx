import React, { useState, useEffect } from "react";
import axios from "axios";
import LastDaysFilter from "./LastDaysFilter";
import CommodityFilter from "./CommodityFilter";
import Chart from "./Chart";
import { fetchCommodities } from "../services/api";
import "../styles/ShippingPointData.css";

const PROXY_URL = "http://localhost:3000/api";

const ShippingPointData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastDays, setLastDays] = useState(7);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [allCommodities, setAllCommodities] = useState([]);

  const loadCommodities = async () => {
    try {
      const data = await fetchCommodities();
      setAllCommodities(data);
    } catch (err) {
      console.error("Error fetching commodities:", err);
    }
  };

  const fetchData = async (days) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${PROXY_URL}/reports/shipping-point?lastDays=${days}`
      );
      setData(response.data);
      setSelectedRow(null); // Reset selected row when new data is fetched
    } catch (err) {
      setError("Failed to load shipping point data");
      console.error("Error fetching shipping point data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommodities();
    fetchData(lastDays);
  }, [lastDays]);

  const handleLastDaysChange = (days) => {
    setLastDays(days);
  };

  const handleCommodityChange = (commodity) => {
    setSelectedCommodity(commodity);
    setSelectedRow(null); // Reset selected row when commodity changes
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const groupByCommodity = (data) => {
    if (!data?.results) return {};
    return data.results.reduce((acc, row) => {
      const commodity = row.commodity || "Unknown";
      if (!acc[commodity]) {
        acc[commodity] = [];
      }
      acc[commodity].push(row);
      return acc;
    }, {});
  };

  const getChartData = () => {
    if (!selectedRow || !data?.results) return null;

    // Filter all results for the same commodity/variety/item_size
    const chartData = data.results.filter(
      (r) =>
        r.commodity === selectedRow.commodity &&
        r.variety === selectedRow.variety &&
        r.item_size === selectedRow.item_size
    );

    // Sort by report_date ascending
    return chartData.sort(
      (a, b) => new Date(a.report_date) - new Date(b.report_date)
    );
  };

  // Get unique commodities from the shipping point data
  const getAvailableCommodities = () => {
    if (!data?.results) return [];
    const availableCommodities = new Set(
      data.results.map((row) => row.commodity)
    );
    return allCommodities.filter((commodity) =>
      availableCommodities.has(commodity.commodity_name)
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading shipping point data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const groupedData = groupByCommodity(data);
  const chartData = getChartData();
  const availableCommodities = getAvailableCommodities();

  return (
    <div className="shipping-point-container">
      <div className="page-header">
        <h2>Shipping Point Data</h2>
        <div className="filters">
          <LastDaysFilter
            lastDays={lastDays}
            onLastDaysChange={handleLastDaysChange}
            options={[
              { value: 1, label: "Last 1 Day" },
              { value: 7, label: "Last 7 Days" },
              { value: 14, label: "Last 14 Days" },
              { value: 21, label: "Last 21 Days" },
              { value: 30, label: "Last 30 Days" },
            ]}
          />
          <CommodityFilter
            commodities={availableCommodities}
            selectedCommodity={selectedCommodity}
            onChange={handleCommodityChange}
          />
        </div>
      </div>

      {selectedRow && chartData && chartData.length > 0 && (
        <div className="chart-container">
          <h3>
            {selectedRow.commodity}{" "}
            {selectedRow.variety ? `- ${selectedRow.variety}` : ""} Price
            History
          </h3>
          <Chart data={chartData} />
        </div>
      )}

      {data && (
        <div className="data-container">
          {Object.entries(groupedData)
            .filter(
              ([commodity]) =>
                !selectedCommodity || commodity === selectedCommodity
            )
            .map(([commodity, rows]) => (
              <div key={commodity} className="commodity-group">
                <h3 className="commodity-header">{commodity}</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Variety</th>
                      <th>High Price</th>
                      <th>Low Price</th>
                      <th>Item Size</th>
                      <th>Package</th>
                      <th>Report Date</th>
                      <th>Market Tone</th>
                      <th>Demand Tone</th>
                      <th>Supply Tone</th>
                      <th>Rep Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => handleRowClick(row)}
                        style={{
                          cursor: "pointer",
                          background:
                            selectedRow &&
                            row.commodity === selectedRow.commodity &&
                            row.variety === selectedRow.variety &&
                            row.item_size === selectedRow.item_size
                              ? "#e3f2fd"
                              : undefined,
                        }}
                      >
                        <td>{row.variety || "-"}</td>
                        <td>{row.high_price || "-"}</td>
                        <td>{row.low_price || "-"}</td>
                        <td>{row.item_size || "-"}</td>
                        <td>{row.pkg || "-"}</td>
                        <td>{row.report_date || "-"}</td>
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
                                <span className="rep-cmt-text">
                                  {row.rep_cmt}
                                </span>
                                <div className="rep-cmt-tooltip">
                                  {row.rep_cmt}
                                </div>
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
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShippingPointData;
