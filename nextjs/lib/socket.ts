"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const port = typeof window !== "undefined" ? window.location.port || "8080" : "8080";
    
    // In Docker setup, Nginx is on 8080.
    const wsUrl = `${protocol}//${host}:${port}`;
    
    socket = io(wsUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
  }
  return socket;
};
