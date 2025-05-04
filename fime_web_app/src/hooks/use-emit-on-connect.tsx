import { useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";

export const useEmitOnConnect = (eventName: string, data: unknown) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !eventName) return;

    const handleConnect = () => {
      socket.emit(eventName, data);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.once("connect", handleConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, eventName, data]);
};
