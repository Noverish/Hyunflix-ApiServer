import * as socketio from 'socket.io';
import { server } from '@src/server-api/app';
import { sockets } from './api';

export function init() {
  const io = socketio(server, { path: '/socket.io/ffmpeg' });
  io.on('connection', (socket) => {
    
    socket.on('message', (buffer: Buffer) => {
      const socketIds = Object.keys(sockets);
      for(const socketId of socketIds) {
        const apiSocket = sockets[socketId];
        apiSocket.send(buffer);
      }
    });
  });
}
