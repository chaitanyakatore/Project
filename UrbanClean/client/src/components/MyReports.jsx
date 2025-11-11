import React, { useState } from "react";
import ReportDetailModal from "./ReportDetailModal";

const MyReports = ({ reports, loading, error, token }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  if (loading) return <p>Loading your reports...</p>;
  if (error) return <p style={{ color: "var(--color-error)" }}>{error}</p>;

  return (
    <>
      <div className="table-container">
        {reports.length === 0 ? (
          <p style={{ padding: "1rem" }}>
            You have not submitted any reports yet.
          </p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Location</th>
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
                  <td>
                    <span
                      className={`status-${report.status.replace(" ", "")}`}
                    >
                      {report.status}
                    </span>
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
        )}
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          isStaff={false}
        />
      )}
    </>
  );
};

export default MyReports;
