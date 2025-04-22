import React, { useEffect, useState } from "react";
import {
  fetchAvailableReports,
  fetchReportData,
  fetchCommodities,
} from "../services/api";
import ReportsList from "./ReportsList";
import SearchBar from "./SearchBar";
import CommodityFilter from "./CommodityFilter";
import ReportDetails from "./ReportDetails";
import ErrorMessage from "./ErrorMessage";
import "../styles/MarketReports.css";

export default function MarketReports() {
  const [reports, setReports] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [commodityFilter, setCommodityFilter] = useState("");
  const [error, setError] = useState("");
  const [lastDays, setLastDays] = useState(90);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAvailableReports(), fetchCommodities()])
      .then(([reportsData, commoditiesData]) => {
        const shippingReports = reportsData.filter((report) =>
          report.market_types?.some((type) =>
            type.toLowerCase().includes("shipping point")
          )
        );
        setReports(shippingReports);
        setFilteredReports(shippingReports);
        setCommodities(commoditiesData);
        setError("");
      })
      .catch((err) => {
        setError("Failed to load initial data");
        console.error("Error loading initial data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredReports(reports);
      return;
    }
    setFilteredReports(
      reports.filter((r) =>
        r.report_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setReportData(null);
    setCommodityFilter("");
    setLastDays(90);
    setIsLoading(true);
    fetchReportData(report.slug_id)
      .then((data) => {
        setReportData(data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to load report data");
        console.error("Error fetching report data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCommodityFilter = (commodityName) => {
    setCommodityFilter(commodityName);
  };

  const handleLastDaysChange = (days) => {
    setLastDays(days);
    if (selectedReport) {
      setIsLoading(true);
      fetchReportData(selectedReport.slug_id, days)
        .then((data) => {
          setReportData(data);
          setError("");
        })
        .catch((err) => {
          setError("Failed to load report data");
          console.error("Error fetching report data:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="market-reports">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Available Reports</h2>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="reports-list-container">
          <ReportsList
            reports={filteredReports}
            onSelect={handleSelectReport}
            selectedReport={selectedReport}
          />
        </div>
      </aside>

      <main className="main-content">
        {error && <ErrorMessage message={error} />}
        <ReportDetails
          report={selectedReport}
          reportData={reportData}
          commodities={commodities}
          commodityFilter={commodityFilter}
          onCommodityFilter={handleCommodityFilter}
          lastDays={lastDays}
          onLastDaysChange={handleLastDaysChange}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
