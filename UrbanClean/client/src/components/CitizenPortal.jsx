import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReportForm from "./ReportForm";
import MyReports from "./MyReports";
import StatCard from "./StatCard";

const API_URL = "http://localhost:5001/api/reports/myreports";

const CitizenPortal = ({ token, handleLogout }) => {
  const [view, setView] = useState("dashboard"); // 'dashboard', 'new_report'
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
      setError("Failed to fetch your reports.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // When a new report is submitted, refresh the list and switch view
  const handleReportSubmitted = () => {
    fetchReports();
    setView("dashboard");
  };

  const pendingReports = reports.filter(
    (r) => r.status === "Submitted" || r.status === "In Progress"
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;

  return (
    <>
      <header className="app-header">
        <h1>
          <span className="header-logo">🌳</span> Citizen Portal
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
                <button
                  className={`sidebar-nav-item ${
                    view === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setView("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`sidebar-nav-item ${
                    view === "new_report" ? "active" : ""
                  }`}
                  onClick={() => setView("new_report")}
                >
                  Submit New Report
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          {view === "dashboard" && (
            <>
              <h2>My Dashboard</h2>
              <div className="stat-card-container">
                <StatCard title="Total Reports" value={reports.length} />
                <StatCard
                  title="Pending Reports"
                  value={pendingReports}
                  className="warning"
                />
                <StatCard
                  title="Resolved Reports"
                  value={resolvedReports}
                  className="success"
                />
              </div>
              <h2 style={{ marginTop: "2rem" }}>My Submitted Reports</h2>
              <MyReports
                reports={reports}
                loading={loading}
                error={error}
                token={token}
              />
            </>
          )}

          {view === "new_report" && (
            <>
              <h2>Submit a New Report</h2>
              <ReportForm
                token={token}
                onReportSubmitted={handleReportSubmitted}
              />
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default CitizenPortal;
