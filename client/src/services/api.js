import axios from "axios";

const PROXY_URL = "http://localhost:3000/api";

export const fetchAvailableReports = async () => {
  const response = await axios.get(`${PROXY_URL}/reports`);
  return response.data;
};

export const fetchReportData = async (reportId, lastDays = 90) => {
  const response = await axios.get(`${PROXY_URL}/reports/${reportId}`, {
    params: {
      allSections: true,
      lastDays,
    },
  });
  return response.data;
};

export const fetchCommodities = async () => {
  const response = await axios.get(`${PROXY_URL}/commodities`);
  return response.data;
};
