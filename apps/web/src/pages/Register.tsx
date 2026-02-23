import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiErrorMessage } from "../api/error";

type FieldErrors = {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
};

function pickFieldErrors(err: unknown): FieldErrors {
  if (!axios.isAxiosError(err)) return {};
  const data: any = err.response?.data;

  const fe = data?.errors?.fieldErrors;
  if (!fe) return {};

  return {
    name: fe?.name?.[0],
    email: fe?.email?.[0],
    mobile: fe?.mobile?.[0],
    password: fe?.password?.[0],
  };
}

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string>("");
  const [fieldErr, setFieldErr] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function clearErr(key?: keyof FieldErrors) {
    setMsg("");
    if (!key) {
      setFieldErr({});
      return;
    }
    setFieldErr((p) => ({ ...p, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setFieldErr({});
    setLoading(true);

    try {
      const res: any = await register(name, email, password, mobile || undefined);

      // ✅ If your AuthContext returns { ok:false } instead of throwing:
      if (res && typeof res === "object" && res.ok === false) {
        setMsg(res.message || "Registration failed");
        setLoading(false);
        return;
      }

      nav("/login");
    } catch (err: any) {
      const fe = pickFieldErrors(err);
      const top = getApiErrorMessage(err, "Registration failed");

      setFieldErr(fe);
      setMsg(top);

      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Create account</h2>

          {msg && (
            <div
              style={{
                marginTop: 10,
                marginBottom: 10,
                padding: 10,
                borderRadius: 10,
                background: "rgba(255, 0, 0, 0.08)",
                color: "var(--danger)",
                border: "1px solid rgba(255, 0, 0, 0.18)",
              }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="label">Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearErr("name");
              }}
              placeholder="Your full name"
              required
            />
            {fieldErr.name && (
              <div className="muted small" style={{ color: "var(--danger)", marginTop: 6 }}>
                {fieldErr.name}
              </div>
            )}

            <div className="label" style={{ marginTop: 12 }}>
              Email
            </div>
            <input
              className="input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearErr("email");
              }}
              placeholder="you@example.com"
              required
            />
            {fieldErr.email && (
              <div className="muted small" style={{ color: "var(--danger)", marginTop: 6 }}>
                {fieldErr.email}
              </div>
            )}

            <div className="label" style={{ marginTop: 12 }}>
              Mobile (optional)
            </div>
            <input
              className="input"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                clearErr("mobile");
              }}
              placeholder="10-digit number"
            />
            {fieldErr.mobile && (
              <div className="muted small" style={{ color: "var(--danger)", marginTop: 6 }}>
                {fieldErr.mobile}
              </div>
            )}

            <div className="label" style={{ marginTop: 12 }}>
              Password
            </div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErr("password");
              }}
              placeholder="Minimum 6-8 characters"
              required
            />
            {fieldErr.password && (
              <div className="muted small" style={{ color: "var(--danger)", marginTop: 6 }}>
                {fieldErr.password}
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <button
                type="button"
                className="btn ghost"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  clearErr();
                  setName("");
                  setEmail("");
                  setMobile("");
                  setPassword("");
                }}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}