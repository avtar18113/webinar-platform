import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Webinars from "../pages/Webinars";
import WebinarDetails from "../pages/WebinarDetails";
import Lobby from "../pages/Lobby";
import Live from "../pages/Live";
import SessionGuard from "../components/SessionGuard";
import AdminLivePanel from "../pages/AdminLivePanel";
export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/webinars", element: <Webinars /> },
  { path: "/webinars/:slug", element: <WebinarDetails /> },
  {
    path: "/webinars/:id/lobby",
    element: (
      <ProtectedRoute>
        <SessionGuard>
          <Lobby />
        </SessionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/webinars/:id/live",
    element: (
      <ProtectedRoute>
        <SessionGuard>
          <Live />
        </SessionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/live",
    element: (
      <ProtectedRoute>
        <AdminLivePanel />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
