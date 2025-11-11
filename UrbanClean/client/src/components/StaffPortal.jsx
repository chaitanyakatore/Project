import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StaffDashboard from "./StaffDashboard";
import StatCard from "./StatCard";

const API_URL = "http://localhost:5001/api/reports";

const StaffPortal = ({ token, handleLogout }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
      setError(null);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch reports.";
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Authorization failed. You may not have staff privileges.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Callback to update the local state when status is changed
  const handleReportUpdate = (updatedReport) => {
    setReports(
      reports.map((r) => (r._id === updatedReport._id ? updatedReport : r))
    );
  };

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "Submitted").length;
  const inProgressReports = reports.filter(
    (r) => r.status === "In Progress"
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;

  return (
    <>
      <header className="app-header">
        <h1>
          <span className="header-logo">🌳</span> Staff Portal
        </h1>
        <div className="nav-buttons">
          <button className="danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li>
                <button className="sidebar-nav-item active">Dashboard</button>
              </li>
              {/* Add more staff links here later */}
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <h2>Main Dashboard</h2>
          <div className="stat-card-container">
            <StatCard title="Total Reports" value={totalReports} />
            <StatCard
              title="New Reports"
              value={pendingReports}
              className="danger"
            />
            <StatCard
              title="In Progress"
              value={inProgressReports}
              className="warning"
            />
            <StatCard
              title="Resolved"
              value={resolvedReports}
              className="success"
            />
          </div>

          <h2 style={{ marginTop: "2rem" }}>All Submitted Reports</h2>
          <StaffDashboard
            reports={reports}
            loading={loading}
            error={error}
            token={token}
            onReportUpdate={handleReportUpdate}
          />
        </main>
      </div>
    </>
  );
};

export default StaffPortal;
