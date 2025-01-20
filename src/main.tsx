import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <Router>
        <App />
      </Router>
    </NextUIProvider>
  </StrictMode>
);
