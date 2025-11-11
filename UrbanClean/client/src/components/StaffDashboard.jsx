import React, { useState } from "react";
import axios from "axios";
import ReportDetailModal from "./ReportDetailModal";

const API_URL = "http://localhost:5001/api/reports";

const StaffDashboard = ({ reports, loading, error, token, onReportUpdate }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_URL}/${reportId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Notify parent to update the main reports list
      onReportUpdate(res.data);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <p>Loading all reports...</p>;
  if (error) return <p style={{ color: "var(--color-error)" }}>{error}</p>;

  return (
    <>
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Location</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Reported On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.category}</td>
                <td>{report.address}</td>
                <td>{report.citizen ? report.citizen.email : "Unknown"}</td>
                <td>
                  <select
                    value={report.status}
                    onChange={(e) =>
                      handleStatusChange(report._id, e.target.value)
                    }
                    className={`status-${report.status.replace(" ", "")}`}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="small secondary"
                    onClick={() => setSelectedReport(report)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          isStaff={true}
        />
      )}
    </>
  );
};

export default StaffDashboard;
