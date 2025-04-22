import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// USDA API Configuration
const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_BASE_URL = process.env.USDA_BASE_URL;

// Create base64 encoded auth string
const authString = Buffer.from(`${USDA_API_KEY}:`).toString("base64");
const USDA_AUTH_HEADER = `Basic ${authString}`;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper function to construct URL with query parameters
function constructUrl(endpoint, params = {}) {
  const url = new URL(endpoint, USDA_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
}

// Get all reports
app.get("/api/reports", async (req, res) => {
  try {
    const url = constructUrl("reports", req.query);
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: USDA_AUTH_HEADER,
      },
    });
    res.json(response.data);
  } catch (error) {
    // console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Get shipping point data
app.get("/api/reports/shipping-point", async (req, res) => {
  console.log("Received shipping point request with query:", req.query);
  try {
    const { lastDays } = req.query;
    console.log("lastDays parameter:", lastDays);

    const url = constructUrl("marketTypes/sc-cr/sc/shippingpt/daily", {
      q: "",
      LastDays: lastDays || 30,
    });
    console.log("Calling USDA Shipping Point API:", url);

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: USDA_AUTH_HEADER,
      },
    });
    console.log("USDA API response status:", response.status);
    res.json(response.data);
  } catch (error) {
    console.log("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({
      error: "Failed to fetch shipping point data",
      details: error.message,
    });
  }
});

// Get specific report
app.get("/api/reports/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const url = constructUrl(`reports/${reportId}`, req.query);
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: USDA_AUTH_HEADER,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// Get report details
app.get("/api/reports/:reportId/Details", async (req, res) => {
  try {
    const { reportId } = req.params;
    const url = constructUrl(`reports/${reportId}/Details`, req.query);
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: USDA_AUTH_HEADER,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching report details:", error);
    res.status(500).json({ error: "Failed to fetch report details" });
  }
});

// Fetch all commodities
app.get("/api/commodities", async (req, res) => {
  try {
    const url = constructUrl("commodities");
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: USDA_AUTH_HEADER,
      },
    });
    res.json(response.data);
  } catch (error) {
    // console.error("Error fetching commodities:", error);
    res.status(500).json({ error: "Failed to fetch commodities" });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
  console.log("Available endpoints:");
  console.log("- GET /api/reports");
  console.log("- GET /api/reports/:reportId");
  console.log("- GET /api/reports/:reportId/Details");
  console.log("- GET /api/reports/shipping-point");
  console.log("- GET /api/commodities");
});
