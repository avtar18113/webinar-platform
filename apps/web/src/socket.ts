import { io, Socket } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
let socket: Socket | null = null;
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
}
export function joinSessionRoom(sessionId: string) {
  const s = getSocket();
  if (sessionId) s.emit("joinSession", { sessionId });
}
export function joinWebinarRoom(webinarId: string) {
  const s = getSocket();
  if (webinarId) s.emit("joinRooms", { webinarId });
}
export function leaveSessionRoom(sessionId: string) {
  const s = getSocket();
  if (sessionId) s.emit("leaveSession", { sessionId });
}
