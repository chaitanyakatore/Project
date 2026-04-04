import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 1. Import the Provider and the store we just made
import { Provider } from "react-redux";
import { store } from "./store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Wrap the App component so every part of our app can access the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
