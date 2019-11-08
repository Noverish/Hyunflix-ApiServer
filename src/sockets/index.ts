import * as socketio from 'socket.io';
import { Server } from 'http';

import userVideo from './user-video';
import examineVideo from './examine-video';
import examineMusic from './examine-music';
import ffmpeg from './ffmpeg';
import downloadYoutube from './download-youtube';

const sockets = {};
const listeners = {};

export default function (server: Server) {
  userVideo(server);
  examineVideo(server);
  examineMusic(server);
  ffmpeg(server);
  downloadYoutube(server);
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

export function send(path: string, payload: object | string) {
  const socketList: socketio.Socket[] = sockets[path];

  for (const socket of socketList) {
    if (typeof payload === 'string') {
      socket.send(payload);
    } else {
      socket.send(JSON.stringify(payload));
    }
  }
}

export function setReceiveListener(path: string, callback: (payload: object) => void) {
  listeners[path] = callback;
}
