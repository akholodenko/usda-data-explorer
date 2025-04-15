import React from "react";

export default function ReportsList({ reports, onSelect }) {
  return (
    <div className="reports-container">
      {reports.map((report) => (
        <div
          key={report.slug_id}
          className="report-item"
          onClick={() => onSelect(report)}
        >
          <div className="report-title">{report.report_title}</div>
          <div className="report-id">ID: {report.slug_id}</div>
        </div>
      ))}
    </div>
  );
}
