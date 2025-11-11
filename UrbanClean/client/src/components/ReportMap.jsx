import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ReportMap = ({ lat, lng }) => {
  // Default to a central location if no coordinates
  const position = [lat || 19.076, lng || 72.8777];
  const zoom = lat ? 15 : 10; // Zoom in if we have coordinates

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={false} // Make it static
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {lat && lng && (
        <Marker position={position}>
          <Popup>Reported Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default ReportMap;
