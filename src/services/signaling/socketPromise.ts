import { Socket } from 'socket.io-client';
/* eslint-disable @typescript-eslint/no-explicit-any */

const socketPromise = (socket: Socket): any => {
  return (type: string, data: unknown = {}): Promise<any> => {
    return new Promise((resolve) => {
      socket.emit(type, data, resolve);
    });
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default socketPromise;
