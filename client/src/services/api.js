import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const fetchAvailableReports = async () => {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data;
};

export const fetchReportData = async (reportId, lastDays = 90) => {
  const response = await axios.get(`${API_URL}/reports/${reportId}`, {
    params: {
      allSections: true,
      lastDays,
    },
  });
  return response.data;
};

export const fetchCommodities = async () => {
  const response = await axios.get(`${API_URL}/commodities`);
  return response.data;
};

export const fetchShippingPointData = async (
  lastDays = 30,
  frequency = "weekly"
) => {
  const response = await axios.get(`${API_URL}/reports/shipping-point`, {
    params: {
      lastDays,
      frequency,
    },
  });
  return response.data;
};
