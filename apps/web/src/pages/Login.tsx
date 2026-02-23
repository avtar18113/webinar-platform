import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/error";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const savedEmail = useMemo(() => localStorage.getItem("savedEmail") || "", []);
  const savedPassword = useMemo(() => localStorage.getItem("savedPassword") || "", []);

  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState(savedPassword);
  const [rememberMe, setRememberMe] = useState(true);
  const [savePassword, setSavePassword] = useState(Boolean(savedEmail && savedPassword));
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await login(email, password, rememberMe, savePassword);
      nav("/dashboard");
    } catch (err: any) {
      // setMsg(err?.message || "Login failed");
      setMsg(getApiErrorMessage(err, "Login failed"));

    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Login</h2>
          {msg && <div className="muted" style={{ color: "var(--danger)" }}>{msg}</div>}
          <form onSubmit={onSubmit}>
            <div className="label">Email</div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="label">Password</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="row" style={{ marginTop: 10 }}>
              <label className="muted small" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me (refresh token longer)
              </label>

              <label className="muted small" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={savePassword} onChange={(e) => setSavePassword(e.target.checked)} />
                Save password (local)
              </label>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}