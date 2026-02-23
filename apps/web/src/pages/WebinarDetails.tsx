import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetWebinarBySlug, apiRegisterWebinar } from "../api/webinars";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/error";

export default function WebinarDetails() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { accessToken } = useAuth();
  const [data, setData] = useState<any>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!slug) return;
    apiGetWebinarBySlug(slug).then(setData).catch(() => setData({ ok: false }));
  }, [slug]);

  async function onRegister() {
    setMsg("");
    if (!accessToken) {
      nav("/login");
      return;
    }
    try {
      const res = await apiRegisterWebinar(data.webinar.id);
      if (!res.ok) throw new Error(res.message || "Register failed");
      nav(`/webinars/${data.webinar.id}/lobby`);
    } catch (e: any) {
      setMsg(getApiErrorMessage(e, "Registration failed"));
    }
  }

  const w = data?.webinar;

  return (
    <>
      <Navbar />
      <div className="container">
        {!data && <div className="muted">Loading...</div>}
        {data && !data.ok && <div className="muted" style={{ color: "var(--danger)" }}>Not found</div>}

        {w && (
          <div className="card">
            <img src={w.thumbnailUrl} alt="Thumbnail" style={{ width: "100%",  objectFit: "cover", borderRadius: 4 }} />
            <h2 style={{ marginTop: 0, fontWeight: 700, fontSize: 36, color: 'var(--text)', lineHeight: '1.4', textAlign: 'center'}}>{w.title}</h2>
            <div className="muted">Starts: {new Date(w.startAt).toLocaleString()}</div>
            <div className="muted">Duration: {w.durationMin} min</div>
            <div className="muted">Status: {w.status}</div>

            <div style={{ marginTop: 14 }}>
              <button className="btn" onClick={onRegister}>Register & Go to Lobby</button>
            </div>

            {msg && <div className="muted" style={{ marginTop: 10, color: "var(--danger)" }}>{msg}</div>}

            <hr style={{ borderColor: "var(--border)", margin: "16px 0" }} />

            <h3>Speakers & Team</h3>
            <div className="row">
              {w.team?.map((t: any) => (
                <div key={t.id} className="card" style={{ width: 260 }}>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div className="muted small">{t.role}</div>
                  <div className="muted small">{t.designation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}