import * as socketio from 'socket.io';
import { Server } from 'http';

import userVideo from './user-video';

const sockets = {};
const listeners = {};

export default function (server: Server) {
  userVideo(server);
}

export function createSocket(server: Server, path: string) {
  const io = socketio(server, { path });
  sockets[path] = [];

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected ${socket.id} at "${path}"`);
    sockets[path].push(socket);

    if (listeners[path]) {
      socket.on('message', (data: Buffer) => {
        const payload = JSON.parse(data.toString());
        listeners[path](payload);
      });
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected ${socket.id} at "${path}"`);
      sockets[path] = sockets[path].filter(s => s !== socket);
    });
  });
}

export function send(path: string, payload: object) {
  const socketList: socketio.Socket[] = sockets[path];

  for (const socket of socketList) {
    socket.send(JSON.stringify(payload));
  }
}

export function setReceiveListener(path: string, callback: (payload: object) => void) {
  listeners[path] = callback;
}
