import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import CitizenPortal from "./components/CitizenPortal";
import StaffPortal from "./components/StaffPortal";

// Helper function to get saved user info
const getInitialUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (token && role) {
    return { token, role };
  }
  return { token: null, role: null };
};

function App() {
  const [user, setUser] = useState(getInitialUser());
  const [view, setView] = useState("landing"); // 'landing', 'login', 'register'

  // This effect ensures that if the user is logged in,
  // we don't show them the landing page, we show their portal.
  useEffect(() => {
    if (user.token && user.role) {
      setView("portal"); // 'portal' view means show the correct role portal
    } else {
      setView("landing"); // No token, show the landing/login page
    }
  }, [user.token, user.role]);

  // Main login handler passed to Login component
  const handleLogin = (data) => {
    const { token, role } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  // Main logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser({ token: null, role: null });
  };

  // Render the correct "page"
  const renderView = () => {
    // If user is logged in, show their role-specific portal
    if (view === "portal" && user.token) {
      if (user.role === "citizen") {
        return <CitizenPortal token={user.token} handleLogout={handleLogout} />;
      }
      if (user.role === "staff") {
        return <StaffPortal token={user.token} handleLogout={handleLogout} />;
      }
    }

    // Default to LandingPage (which handles its own login/register views)
    return <LandingPage onLogin={handleLogin} />;
  };

  return <div className="app-container">{renderView()}</div>;
}

export default App;
