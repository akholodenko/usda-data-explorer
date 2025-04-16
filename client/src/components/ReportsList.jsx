import React from "react";

export default function ReportsList({ reports, onSelect, selectedReport }) {
  return (
    <div className="reports-container">
      {reports.map((report) => (
        <div
          key={report.slug_id}
          className="report-item"
          style={{
            background:
              selectedReport && report.slug_id === selectedReport.slug_id
                ? "#e3f2fd"
                : undefined,
            border:
              selectedReport && report.slug_id === selectedReport.slug_id
                ? "2px solid #1976d2"
                : undefined,
          }}
          onClick={() => onSelect(report)}
        >
          <div className="report-title">{report.report_title}</div>
          <div className="report-id">ID: {report.slug_id}</div>
        </div>
      ))}
    </div>
  );
}
