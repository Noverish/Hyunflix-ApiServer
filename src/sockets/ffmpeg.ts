import { Server } from 'http';

import { createSocket } from '@src/sockets';
import { FFMPEG_SOCKET_PATH } from '@src/config';

export default function (server: Server) {
  createSocket(server, FFMPEG_SOCKET_PATH);
}
