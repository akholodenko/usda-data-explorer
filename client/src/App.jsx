import React, { useEffect, useState } from "react";
import {
  fetchAvailableReports,
  fetchReportData,
  fetchCommodities,
} from "./services/api";
import ReportsList from "./components/ReportsList";
import SearchBar from "./components/SearchBar";
import CommodityFilter from "./components/CommodityFilter";
import ReportDetails from "./components/ReportDetails";
import ErrorMessage from "./components/ErrorMessage";
import "./styles/App.css";

export default function App() {
  const [reports, setReports] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [commodityFilter, setCommodityFilter] = useState("");
  const [error, setError] = useState("");
  const [lastDays, setLastDays] = useState(90); // Default to 90 days
  const [isLoading, setIsLoading] = useState(false);

  // Load reports and commodities on mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAvailableReports(), fetchCommodities()])
      .then(([reportsData, commoditiesData]) => {
        // Filter for Shipping Point reports
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

  // Filter reports by search
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

  // When a report is selected, fetch its data
  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setReportData(null);
    setCommodityFilter("");
    setLastDays(90); // Reset to default when selecting a new report
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

  // Filter report details by commodity
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
    <div className="app">
      <header>
        <h1>USDA Market Reports</h1>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <h2>Available Reports</h2>
          <SearchBar onSearch={handleSearch} />
          <ReportsList
            reports={filteredReports}
            onSelect={handleSelectReport}
            selectedReport={selectedReport}
          />
        </aside>

        <main className="main-content">
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
    </div>
  );
}
