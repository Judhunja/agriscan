import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// Register service worker for offline support & model caching
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("AgriScan SW registered:", reg.scope))
      .catch((err) => console.warn("AgriScan SW registration failed:", err));
  });
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
