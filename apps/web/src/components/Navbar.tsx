import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  

  return (
    <div className="topbar">
      <div className="container">
        <div className="nav">
          <Link className="brand" to="/">Webinar Platform</Link>
          <div className="spacer" />
          <button className="btn ghost" onClick={toggle}>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
          {user ? (
            <>
              <div className="small muted">{user.name} • {user.role}</div>
              <button className="btn ghost" onClick={logout}>Logout</button>
              <Link className="btn ghost" to="/webinars">Webinars</Link>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}