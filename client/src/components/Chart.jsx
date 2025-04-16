import React, { useEffect, useRef } from "react";
import ChartJS from "chart.js/auto";

function movingAverage(data, key, windowSize = 11) {
  if (!data || data.length === 0) return [];
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    const avg =
      window.reduce((sum, d) => sum + (parseFloat(d[key]) || 0), 0) /
      window.length;
    result.push(Number.isNaN(avg) ? null : avg);
  }
  return result;
}

function aggregateByDate(data) {
  // { date: { high: ..., low: ... } }
  const map = {};
  data.forEach((d) => {
    if (
      !d.report_date ||
      d.high_price === undefined ||
      d.low_price === undefined ||
      d.high_price === "" ||
      d.low_price === ""
    )
      return;
    if (!map[d.report_date]) {
      map[d.report_date] = {
        report_date: d.report_date,
        high_price: parseFloat(d.high_price),
        low_price: parseFloat(d.low_price),
      };
    } else {
      map[d.report_date].high_price = Math.max(
        map[d.report_date].high_price,
        parseFloat(d.high_price)
      );
      map[d.report_date].low_price = Math.min(
        map[d.report_date].low_price,
        parseFloat(d.low_price)
      );
    }
  });
  // Return sorted by date ascending
  return Object.values(map).sort(
    (a, b) => new Date(a.report_date) - new Date(b.report_date)
  );
}

export default function Chart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    // First, filter out data points missing high_price or low_price
    const filteredData = data.filter(
      (d) =>
        d.high_price !== undefined &&
        d.high_price !== null &&
        d.high_price !== "" &&
        d.low_price !== undefined &&
        d.low_price !== null &&
        d.low_price !== ""
    );
    // Then, aggregate by date, using highest high and lowest low
    const aggregated = aggregateByDate(filteredData);
    if (aggregated.length === 0) return;
    const ctx = chartRef.current.getContext("2d");
    const labels = aggregated.map((d) => d.report_date);
    const highAvg = movingAverage(aggregated, "high_price", 11);
    const lowAvg = movingAverage(aggregated, "low_price", 11);
    const chart = new ChartJS(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "High Price (smoothed)",
            data: highAvg,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            tension: 0.7,
            spanGaps: true,
          },
          {
            label: "Low Price (smoothed)",
            data: lowAvg,
            borderColor: "#ff9800",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            tension: 0.7,
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: false },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
}
