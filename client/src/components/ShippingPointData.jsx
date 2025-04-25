import React, { useState, useEffect, useRef } from "react";
import LastDaysFilter from "./LastDaysFilter";
import CommodityFilter from "./CommodityFilter";
import FrequencyFilter from "./FrequencyFilter";
import Chart from "./Chart";
import CommoditySection from "./CommoditySection";
import { fetchCommodities, fetchShippingPointData } from "../services/api";
import "../styles/ShippingPointData.css";

// Helper function moved outside components to be accessible to both
const getUniqueVarieties = (rows) => {
  return rows
    .map((row) => row.variety)
    .filter((v) => v && v !== "-" && v !== "N/A" && v.trim() !== "")
    .filter((v, i, self) => self.indexOf(v) === i);
};

const ShippingPointData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastDays, setLastDays] = useState(30);
  const [frequency, setFrequency] = useState("weekly");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [allCommodities, setAllCommodities] = useState([]);
  const [selectedVarieties, setSelectedVarieties] = useState({});
  const initialFetchDone = useRef(false);
  const commoditiesFetchDone = useRef(false);

  const loadCommodities = async () => {
    const currentValue = commoditiesFetchDone.current;
    commoditiesFetchDone.current = true;

    if (currentValue) return;

    try {
      const data = await fetchCommodities();
      setAllCommodities(data);
    } catch (err) {
      console.error("Error fetching commodities:", err);
    }
  };

  const fetchData = async (days) => {
    const currentValue = initialFetchDone.current;
    initialFetchDone.current = true;

    setLoading(true);
    setError("");
    try {
      const data = await fetchShippingPointData(days, frequency);
      setData(data);
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
  }, []);

  useEffect(() => {
    initialFetchDone.current = false; // Reset the flag when dependencies change
    fetchData(lastDays);
  }, [lastDays, frequency]);

  const handleLastDaysChange = (days) => {
    setLastDays(days);
  };

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);
  };

  const handleCommodityChange = (commodity) => {
    setSelectedCommodity(commodity);
    setSelectedRow(null); // Reset selected row when commodity changes
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleVarietyClick = (commodity, variety) => {
    setSelectedVarieties((prev) => ({
      ...prev,
      [commodity]: prev[commodity] === variety ? null : variety,
    }));
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

    // Filter all results for the same commodity/variety/item_size/organic
    const chartData = data.results.filter(
      (r) =>
        r.commodity === selectedRow.commodity &&
        r.variety === selectedRow.variety &&
        r.item_size === selectedRow.item_size &&
        r.organic === selectedRow.organic
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

  // Get commodity group for a given commodity name
  const getCommodityGroup = (rows) => {
    // Get the first row's group (all rows in a group should have the same group)
    return rows[0]?.group || "";
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
              { value: 90, label: "Last 90 Days" },
              { value: 180, label: "Last 180 Days" },
              { value: 365, label: "Last Year" },
            ]}
          />
          <FrequencyFilter
            frequency={frequency}
            onFrequencyChange={handleFrequencyChange}
          />
          <CommodityFilter
            commodities={availableCommodities}
            selectedCommodity={selectedCommodity}
            onChange={handleCommodityChange}
          />
        </div>
      </div>

      {selectedRow && chartData && chartData.length > 0 && (
        <div className="chart-section">
          <div className="chart-container">
            <h3>
              {selectedRow.commodity}{" "}
              {selectedRow.variety ? `- ${selectedRow.variety}` : ""} Price
              History
            </h3>
            <Chart data={chartData} />
          </div>
          <div className="price-stats">
            <h4>Price Statistics</h4>
            <div className="stat-item">
              <span className="stat-label">Highest Price:</span>
              <span className="stat-value">
                {(() => {
                  const prices = chartData.map((d) => d.high_price);
                  const validPrices = prices
                    .map((price) => parseFloat(price))
                    .filter((price) => !isNaN(price));
                  return validPrices.length > 0
                    ? `$${Math.max(...validPrices).toFixed(2)}`
                    : "N/A";
                })()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lowest Price:</span>
              <span className="stat-value">
                {(() => {
                  const prices = chartData.map((d) => d.low_price);
                  const validPrices = prices
                    .map((price) => parseFloat(price))
                    .filter((price) => !isNaN(price));
                  return validPrices.length > 0
                    ? `$${Math.min(...validPrices).toFixed(2)}`
                    : "N/A";
                })()}
              </span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <span className="stat-label">Latest High:</span>
              <span className="stat-value">
                {(() => {
                  const latest = chartData[chartData.length - 1];
                  return latest && !isNaN(parseFloat(latest.high_price))
                    ? `$${parseFloat(latest.high_price).toFixed(2)}`
                    : "N/A";
                })()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Latest Low:</span>
              <span className="stat-value">
                {(() => {
                  const latest = chartData[chartData.length - 1];
                  return latest && !isNaN(parseFloat(latest.low_price))
                    ? `$${parseFloat(latest.low_price).toFixed(2)}`
                    : "N/A";
                })()}
              </span>
            </div>
            <div className="stat-info">
              <small>Sizing: {selectedRow.item_size}</small>
              {selectedRow.variety && (
                <small>Variety: {selectedRow.variety}</small>
              )}
              <small>
                Organic: {selectedRow.organic === "Y" ? "Yes" : "No"}
              </small>
              {selectedRow.package && (
                <small>Package: {selectedRow.package}</small>
              )}
              {selectedRow.quality && (
                <small>Quality: {selectedRow.quality}</small>
              )}
              {selectedRow.condition && (
                <small>Condition: {selectedRow.condition}</small>
              )}
            </div>
          </div>
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
              <CommoditySection
                key={commodity}
                commodity={commodity}
                rows={rows}
                selectedRow={selectedRow}
                onRowClick={handleRowClick}
                selectedVarieties={selectedVarieties}
                handleVarietyClick={handleVarietyClick}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ShippingPointData;
