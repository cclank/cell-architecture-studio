import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PRODUCT } from "./config/product";
import "./styles.css";
import "./styles.igb.css";

const appFallback = (
  <div className="app-crash">
    <h1>{PRODUCT.name}</h1>
    <p>Something went wrong loading the studio. Please refresh the page to try again.</p>
    <button type="button" onClick={() => window.location.reload()}>
      Reload
    </button>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={appFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
