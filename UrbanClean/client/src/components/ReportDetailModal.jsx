import React from "react";
import ReportMap from "./ReportMap";

const ReportDetailModal = ({ report, onClose, isStaff }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Details</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Report ID:</strong> {report._id}
          </p>
          <p>
            <strong>Category:</strong> {report.category}
          </p>
          <p>
            <strong>Address:</strong> {report.address}
          </p>
          <p>
            <strong>Description:</strong> {report.description}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`status-${report.status.replace(" ", "")}`}
              style={{ marginLeft: "0.5rem" }}
            >
              {report.status}
            </span>
          </p>
          {isStaff && (
            <p>
              <strong>Reported By:</strong> {report.citizen.email}
            </p>
          )}
          <p>
            <strong>Reported On:</strong>{" "}
            {new Date(report.createdAt).toLocaleString()}
          </p>

          {report.imageUrl && (
            <>
              <h4>Photo Evidence</h4>
              <img src={report.imageUrl} alt="Report evidence" />
            </>
          )}

          <h4>Location</h4>
          <div className="modal-map-container">
            <ReportMap lat={report.latitude} lng={report.longitude} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
