import { Socket } from "socket.io";

interface ClientToServerEvents {
  hello: () => void;
}
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}
interface InterServerEvents {
  ping: () => void;
}
interface SocketData {
  name: string;
  age: number;
}

export {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
}
