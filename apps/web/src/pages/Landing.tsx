import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiHealth } from "../api/auth";

export default function Landing() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    apiHealth().then(setHealth).catch(() => setHealth({ ok: false }));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Welcome</h2>
          <p className="muted">
            Secure webinar platform with single-device login, polls, Q&A, watch-time tracking.
          </p>
          <div className="row">
            <div className="card" style={{ flex: 1, minWidth: 260 }}>
              <div className="muted small">API Status</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {health ? (health.ok ? "Connected ✅" : "Offline ❌") : "Checking..."}
              </div>
              {health?.db && <div className="muted small">DB: {health.db}</div>}
            </div>
            <div className="card" style={{ flex: 2, minWidth: 260 }}>
              <h3 style={{ marginTop: 0 }}>Next Screens (Phase 2)</h3>
              <ul className="muted" style={{ margin: 0 }}>
                <li>Webinar Listing</li>
                <li>Webinar Details + Register</li>
                <li>Lobby Countdown</li>
                <li>Live Page Layout + Chat + Poll panel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}