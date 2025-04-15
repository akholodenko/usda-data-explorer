import axios from "axios";

export const PROXY_URL = "http://localhost:3000/api";

export const fetchReports = () =>
  axios.get(`${PROXY_URL}/reports`).then((res) => res.data);

export const fetchReportData = (reportId) =>
  axios
    .get(`${PROXY_URL}/reports/${reportId}?allSections=true&lastDays=365`)
    .then((res) => res.data);

export const fetchCommodities = () =>
  axios.get(`${PROXY_URL}/commodities`).then((res) => res.data);
