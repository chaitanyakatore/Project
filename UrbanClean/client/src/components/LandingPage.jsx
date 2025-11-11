import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

// This is the new "home page" for logged-out users.
// It will show the landing content, or the Login/Register forms.

const LandingPage = ({ onLogin }) => {
  // 'landing', 'login', 'register'
  const [view, setView] = useState("landing");

  const renderContent = () => {
    if (view === "login") {
      return <Login onLogin={onLogin} />;
    }
    if (view === "register") {
      return <Register onRegister={onLogin} />; // onRegister logs the user in
    }

    // Default 'landing' view
    return (
      <div className="hero">
        <h1>Welcome to UrbanClean</h1>
        <p>
          Your partner in building cleaner, greener, and more responsive cities.
          Report issues, track progress, and be part of the solution.
        </p>
        <img
          src="https://placehold.co/600x300/EDF7ED/0A4D22?text=Clean+City"
          alt="Clean city park"
          className="hero-image"
        />
        <div className="cta-buttons">
          <button className="primary" onClick={() => setView("login")}>
            Login
          </button>
          <button className="secondary" onClick={() => setView("register")}>
            Register
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="app-header">
        <h1>
          <span className="header-logo">🌳</span> UrbanClean
        </h1>
        <div className="nav-buttons">
          {view !== "landing" && (
            <button className="secondary" onClick={() => setView("landing")}>
              Back to Home
            </button>
          )}
          {view !== "login" && (
            <button className="primary" onClick={() => setView("login")}>
              Login
            </button>
          )}
          {view !== "register" && (
            <button className="secondary" onClick={() => setView("register")}>
              Register
            </button>
          )}
        </div>
      </header>
      <main className="app-main landing-page">{renderContent()}</main>
    </>
  );
};

export default LandingPage;
