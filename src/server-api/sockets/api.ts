import * as socketio from 'socket.io';
import { server } from '@src/server-api/app';

export const sockets = {};

export function init() {
  const io = socketio(server, { path: '/socket.io/api' });
  io.on('connection', (socket) => {
    sockets[socket.id] = socket;
    
    socket.on('disconnect', function(){
      delete sockets[socket.id];
    });
  });
}
