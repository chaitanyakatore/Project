import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// --- IMPORT LEAFLET CSS ---
// This is critical for maps to work!
import "leaflet/dist/leaflet.css";

import "./index.css"; // Load the new theme

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
