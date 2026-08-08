import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "", stack: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || String(error), stack: error?.stack || "" };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Insider crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0C1210",
            color: "#F3F6F1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Something went wrong</p>
          <p style={{ fontSize: 13, color: "#8B9A8E", marginBottom: 12, maxWidth: 320 }}>
            That result may have come back in an unexpected format. Try again — your recent scans are still saved.
          </p>
          <div
            style={{
              background: "#161D19",
              border: "1px solid #2A342D",
              borderRadius: 12,
              padding: "12px",
              maxWidth: 340,
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: 11, color: "#FF6152", fontFamily: "monospace", wordBreak: "break-word", margin: 0 }}>
              {this.state.message}
            </p>
            <p style={{ fontSize: 10, color: "#8B9A8E", fontFamily: "monospace", wordBreak: "break-word", marginTop: 6, whiteSpace: "pre-wrap" }}>
              {this.state.stack.split("\n").slice(0, 4).join("\n")}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#C6FF4D",
              color: "#0C1210",
              border: "none",
              borderRadius: 16,
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // registration failure is non-critical — app still works without offline caching
    });
  });
}
