"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const port = typeof window !== "undefined" ? window.location.port : "";
    
    // If port is present, add it to the URL, otherwise use the host alone (standard ports)
    const wsUrl = port ? `${protocol}//${host}:${port}` : `${protocol}//${host}`;
    
    socket = io(wsUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
  }
  return socket;
};
