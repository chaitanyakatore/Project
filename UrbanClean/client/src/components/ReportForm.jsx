import React, { useState, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const API_URL = "http://localhost:5001/api/reports";

// Component to handle map clicks
function MapClickHandler({ setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng); // Set the lat/lng state
      map.flyTo(e.latlng, map.getZoom()); // Pan the map
    },
  });
  return null;
}

const ReportForm = ({ token, onReportSubmitted }) => {
  const [category, setCategory] = useState("Illegal Dumping");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [reportImage, setReportImage] = useState(null);
  const [position, setPosition] = useState(null); // [lat, lng]

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!position) {
      setMessage({
        type: "error",
        text: "❌ Please click on the map to select a location.",
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    if (reportImage) {
      formData.append("reportImage", reportImage);
    }

    try {
      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: "Report submitted successfully!" });
      // Reset form
      setCategory("Illegal Dumping");
      setAddress("");
      setDescription("");
      setReportImage(null);
      setPosition(null);
      e.target.reset();

      // Tell the parent portal to refresh
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Submission failed.";
      setMessage({ type: "error", text: `❌ ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  const marker = useMemo(
    () => (position ? <Marker position={position}></Marker> : null),
    [position]
  );

  return (
    <div className="form-container" style={{ maxWidth: "800px" }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">
            1. Click on the map to pinpoint the issue
          </label>
          <MapContainer
            center={[19.076, 72.8777]} // Default: Mumbai
            zoom={10}
            style={{ height: "300px", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler setPosition={setPosition} />
            {marker}
          </MapContainer>
          {position && (
            <small>
              Location selected: {position.lat.toFixed(4)},{" "}
              {position.lng.toFixed(4)}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">2. Address or Landmark</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., Near City Park gate"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">3. Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Illegal Dumping">Illegal Dumping</option>
            <option value="Missed Pickup">Missed Pickup</option>
            <option value="Damaged Bin">Damaged Bin</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">4. Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="reportImage">5. Photo (Optional)</label>
          <input
            type="file"
            id="reportImage"
            accept="image/*"
            onChange={(e) => setReportImage(e.target.files[0])}
          />
        </div>

        {message.text && (
          <div className={`form-message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
