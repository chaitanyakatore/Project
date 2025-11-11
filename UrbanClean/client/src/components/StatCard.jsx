import React from "react";

const StatCard = ({ title, value, className = "" }) => {
  return (
    <div className={`stat-card ${className}`}>
      <p className="stat-card-title">{title}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
};

export default StatCard;
