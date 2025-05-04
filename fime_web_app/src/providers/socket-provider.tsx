"use client";

import { createContext, useRef, useContext, ReactNode, useEffect } from "react";
import { Socket } from "socket.io-client";
import { createSocketInstance } from "@/lib/socket";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = createSocketInstance();
  }

  useEffect(() => {
    if (!socketRef.current?.connected) {
      socketRef.current?.connect();
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
