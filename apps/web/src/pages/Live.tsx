import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { http } from "../api/http";
import { apiJoinWebinar } from "../api/webinars";
import { joinSessionRoom } from "../socket";

export default function Live() {
  const { id } = useParams();
  const nav = useNavigate();

  const [webinar, setWebinar] = useState<any>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function loadLobby() {
    if (!id) return;

    setLoading(true);
    setErr("");

    try {
      // ✅ ensure session exists (auto rejoin if missing)
      const existing = localStorage.getItem(`sessionId:${id}`);
      if (!existing) {
        const joinRes = await apiJoinWebinar(id);
        if (!joinRes.ok) throw new Error(joinRes.message || "Join failed");

        localStorage.setItem(`sessionId:${id}`, joinRes.sessionId);
        joinSessionRoom(joinRes.sessionId);
      }

      // ✅ now lobby should work because http.ts will attach X-Session-Id
      const res = await http.get(`/api/webinars/${id}/lobby`);
      setWebinar(res.data.webinar);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Live load failed";

      setErr(msg);

      // optional: if token expired
      if (e?.response?.status === 401) {
        // go login, or you can implement refresh interceptor later
        // nav("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function clearSessionAndRetry() {
    if (!id) return;
    localStorage.removeItem(`sessionId:${id}`);
    loadLobby();
  }

  useEffect(() => {
    loadLobby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container">
        {loading && <div className="muted">Loading live session...</div>}

        {!loading && err && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: "var(--danger)" }}>Live Access Issue</h3>
            <div className="muted">{err}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn" onClick={() => nav(`/webinars/${id}/lobby`)}>
                Back to Lobby
              </button>
              <button className="btn ghost" onClick={clearSessionAndRetry}>
                Clear Session & Retry
              </button>
              <Link className="btn ghost" to="/webinars">
                Go to Webinars
              </Link>
            </div>
          </div>
        )}

        {!loading && !err && webinar && (
          <div className="card">
            <h2 style={{ marginTop: 0 }}>{webinar.title}</h2>

            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${webinar.youtubeVideoId}`}
              title="Webinar"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </>
  );
}