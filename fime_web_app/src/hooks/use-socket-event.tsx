import { useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";

export const useSocketEvent = (
  event: string,
  callback: (data: unknown) => void
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
};
