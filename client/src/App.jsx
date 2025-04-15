import React, { useEffect, useState } from "react";
import { fetchReports, fetchReportData, fetchCommodities } from "./api";
import ReportsList from "./components/ReportsList";
import SearchBar from "./components/SearchBar";
import CommodityFilter from "./components/CommodityFilter";
import ReportDetails from "./components/ReportDetails";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
  const [reports, setReports] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [commodityFilter, setCommodityFilter] = useState("");
  const [error, setError] = useState("");

  // Load reports and commodities on mount
  useEffect(() => {
    fetchReports()
      .then((data) => {
        // Filter for Shipping Point reports
        const shippingReports = data.filter((report) =>
          report.market_types?.some((type) =>
            type.toLowerCase().includes("shipping point")
          )
        );
        setReports(shippingReports);
        setFilteredReports(shippingReports);
      })
      .catch(() => setError("Failed to load reports"));

    fetchCommodities()
      .then(setCommodities)
      .catch(() => setError("Failed to load commodities"));
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
    fetchReportData(report.slug_id)
      .then(setReportData)
      .catch(() => setError("Failed to load report data"));
  };

  // Filter report details by commodity
  const handleCommodityFilter = (commodityName) => {
    setCommodityFilter(commodityName);
  };

  return (
    <div className="container">
      <h1>USDA Data Visualization (React)</h1>
      <ErrorMessage message={error} />
      <SearchBar onSearch={handleSearch} />
      <div className="reports-list">
        <h2>Shipping Point Reports</h2>
        <ReportsList reports={filteredReports} onSelect={handleSelectReport} />
      </div>
      <div className="data-display">
        <ReportDetails
          report={selectedReport}
          reportData={reportData}
          commodities={commodities}
          commodityFilter={commodityFilter}
          onCommodityFilter={handleCommodityFilter}
        />
      </div>
    </div>
  );
}
