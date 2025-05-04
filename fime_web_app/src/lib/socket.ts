import { io, type Socket } from "socket.io-client";
import envConfig from "@/config";

export const createSocketInstance = (): Socket => {
  return io(envConfig.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
  });
};
