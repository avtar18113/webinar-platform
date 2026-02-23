import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket, joinSessionRoom } from "../socket";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const s = getSocket();

    // If session already exists (page refresh), re-join room
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) joinSessionRoom(sessionId);

    const onForceLogout = (data: any) => {
      alert(data?.reason || "You have been logged out because you logged in elsewhere.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
      navigate("/login");
    };

    s.on("forceLogout", onForceLogout);

    return () => {
      s.off("forceLogout", onForceLogout);
    };
  }, [navigate]);

  return <>{children}</>;
}