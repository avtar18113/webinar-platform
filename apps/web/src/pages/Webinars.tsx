import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiListWebinars } from "../api/webinars";
import { Link } from "react-router-dom";

export default function Webinars() {
  const [data, setData] = useState<any>(null);
console.log("Webinars data:", data);
  useEffect(() => {
    apiListWebinars().then(setData).catch(() => setData({ ok: false }));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Upcoming Webinars</h2>

        {!data && <div className="muted">Loading...</div>}
        {data && !data.ok && <div className="muted" style={{ color: "var(--danger)" }}>Failed to load</div>}

        <div className="row">
          {data?.webinars?.map((w: any) => (
            <div className="card" key={w.id} style={{ width: 320 }}>
              <img src={w.thumbnailUrl} alt="Thumbnail" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4 }} />
              <div style={{ fontWeight: 800 }}>{w.title}</div>
              <div className="muted small">{new Date(w.startAt).toLocaleString()}</div>
              <div className="muted small">Status: {w.status}</div>

              <div style={{ marginTop: 10 }}>
                <Link className="btn center" to={`/webinars/${w.slug}`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}