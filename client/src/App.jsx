import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MarketReports from "./components/MarketReports";
import ShippingPointData from "./components/ShippingPointData";
import "./styles/App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>USDA Market Reports</h1>
          <nav className="main-nav">
            <Link to="/" className="nav-link">
              Market Reports
            </Link>
            <Link to="/shipping-point" className="nav-link">
              Shipping Point Data
            </Link>
          </nav>
        </header>

        <div className="app-container">
          <Routes>
            <Route path="/" element={<MarketReports />} />
            <Route path="/shipping-point" element={<ShippingPointData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
