import React, { useEffect, useRef } from "react";
import ChartJS from "chart.js/auto";

export default function Chart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    const ctx = chartRef.current.getContext("2d");
    const chart = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => d.report_date),
        datasets: [
          {
            label: "High Price",
            data: data.map((d) => d.high_price),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
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
