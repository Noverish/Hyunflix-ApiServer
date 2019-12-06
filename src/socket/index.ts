import * as socketio from 'socket.io';
import { Server } from 'http';

import { UserVideoService } from '@src/services';

let io;

export default function (server: Server) {
  io = socketio(server);

  initNamespace('/user-video', (payload: object) => {
    UserVideoService.update(payload).catch(console.error);
  });
}

function initNamespace(ns: string, callback: (payload: object) => void) {
  const nsp = io.of(ns);
  nsp.on('connection', (socket) => {
    console.log(`[Socket] Connected ${socket.id} at "${ns}"`);

    socket.on('message', (data: Buffer) => {
      callback(JSON.parse(data.toString()));
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected ${socket.id} at "${ns}"`);
    });
  });
}

export function send(ns: string, payload: object) {
  io.of(ns).send(JSON.stringify(payload));
}
