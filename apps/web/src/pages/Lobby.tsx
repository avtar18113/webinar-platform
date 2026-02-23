import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetLobby, apiJoinWebinar } from "../api/webinars";
import { getSocket, joinWebinarRoom } from "../socket";
import { joinSessionRoom, leaveSessionRoom } from "../socket";

function formatTime(sec: number) {
  const s = Math.max(0, sec);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${d}d ${h}h ${m}m ${r}s`;
}

export default function Lobby() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState<any>(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    apiGetLobby(id)
      .then(setData)
      .catch((e) => {
        setData({
          ok: false,
          message: e?.response?.data?.message || "Lobby load failed",
        });
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;

    joinWebinarRoom(id);

    const s = getSocket();
    const handler = (payload: any) => {
      if (payload?.webinarId !== id) return;

      // update local state instantly
      setData((prev: any) => {
        if (!prev?.webinar) return prev;
        return {
          ...prev,
          webinar: {
            ...prev.webinar,
            status:
              payload.status === "LIVE"
                ? "LIVE"
                : payload.status === "COMPLETED"
                  ? "COMPLETED"
                  : prev.webinar.status,
            startAt: payload.startAt ?? prev.webinar.startAt,
          },
        };
      });
    };

    s.on("webinarStatus", handler);
    return () => {
      s.off("webinarStatus", handler);
    };
  }, [id]);

  // countdown tick
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const secondsToStart = useMemo(() => {
    const s = data?.webinar?.secondsToStart ?? 0;
    const newS = Math.max(0, s - tick);
    return newS;
  }, [data, tick]);

  async function onJoin() {
    if (!id) return;
    setMsg("");
    try {
      // leave old session room (important!)
      const oldSessionId = localStorage.getItem(`sessionId:${id}`);
      if (oldSessionId) {
        leaveSessionRoom(oldSessionId);
      }

      const res = await apiJoinWebinar(id);
      if (!res.ok) throw new Error(res.message || "Join failed");
      const sessionId = res.sessionId;
      // Store sessionId for X-Session-Id header
      localStorage.setItem(`sessionId:${id}`, sessionId);
      // localStorage.setItem("sessionId", sessionId);
      joinSessionRoom(sessionId);
      // Next page (Live page in Phase 3)
      nav(`/webinars/${id}/live`);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  const w = data?.webinar;

  return (
    <>
      <Navbar />
      <div className="container">
        {!data && <div className="muted">Loading lobby...</div>}

        {data && !data.ok && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: "var(--danger)" }}>
              Lobby Access Denied
            </h3>
            <div className="muted">{data.message}</div>
          </div>
        )}

        {w && (
          <div className="card">
            <h2 style={{ marginTop: 0 }}>{w.title}</h2>
            <div className="muted">Status: {w.status}</div>

            {w.status === "UPCOMING" && (
              <div className="card" style={{ marginTop: 12 }}>
                <div className="muted small">Webinar starts in</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>
                  {formatTime(secondsToStart)}
                </div>
                <div className="muted small">
                  Waiting for host to go live...
                </div>
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <button
                className="btn"
                onClick={onJoin}
                disabled={w.status !== "LIVE"}
              >
                Join Webinar
              </button>
              <div className="muted small" style={{ marginTop: 6 }}>
                Join button enables only when webinar becomes LIVE.
              </div>
            </div>

            {msg && (
              <div
                className="muted"
                style={{ marginTop: 10, color: "var(--danger)" }}
              >
                {msg}
              </div>
            )}

            <hr style={{ borderColor: "var(--border)", margin: "16px 0" }} />

            <h3>Speaker & Coordinator</h3>
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
