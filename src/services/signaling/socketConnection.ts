import io, { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { env } from "../environment/envService";
import socketPromise from "./socketPromise";

export default class Signaling {
  socket: Socket | undefined;

  connect = (): void => {
    const opts: Partial<ManagerOptions & SocketOptions> = {
      path: "",
      transports: ["websocket"],
      timeout: 10000,
    };
    const serverUrl = env.backendBaseURL;

    this.socket = io(serverUrl, opts);
    this.socketPromiseRequest = socketPromise(this.socket);

    this.socket.on("error", (err) => {
      console.error(`error: ${err.message}`);
    });
  };

  disconnect = (): void => {
    this.socket?.disconnect();
  };

  socketPromiseRequest:
    | ((type: string, data: unknown) => Promise<unknown>)
    | undefined;

  requestPromise = async (key: string, value?: any): Promise<unknown> => {
    // console.log(`uniqueId: ${getUniqueId()}`);
    return this.socketPromiseRequest?.(key, value ?? null);
  };

  request = (key: string, value?: unknown): any => {
    // console.log(`Send ${key}: ${value}`);
    this.socket?.emit(key, value);
  };
}
