import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { http } from "../api/http";
import { adminGoLive, adminEndLive } from "../api/adminLive";

export default function AdminLivePanel() {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const res = await http.get("/api/admin/webinars"); // your existing admin list
    setWebinars(res.data.webinars || []);
  }

  useEffect(() => {
    load().catch((e) => setMsg(e?.response?.data?.message || e.message));
  }, []);

  async function goLive(id: string) {
    setMsg("");
    try {
      await adminGoLive(id);
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function endLive(id: string) {
    setMsg("");
    try {
      await adminEndLive(id);
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Admin Live Control</h2>
          {msg && (
            <div className="muted" style={{ color: "var(--danger)" }}>
              {msg}
            </div>
          )}

          <div className="row" style={{ gap: 12 }}>
            {webinars.map((w) => (
              <div key={w.id} className="card" style={{ width: 340 }}>
                <div style={{ fontWeight: 800 }}>{w.title}</div>
                <div className="muted small">Status: {w.status}</div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button
                    className="btn"
                    onClick={() => goLive(w.id)}
                    disabled={w.status === "LIVE"}
                  >
                    Go LIVE
                  </button>
                  <button
                    className="btn ghost"
                    onClick={() => endLive(w.id)}
                    disabled={w.status === "COMPLETED"}
                  >
                    End LIVE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
