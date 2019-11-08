import { Server } from 'http';

import { createSocket } from '@src/sockets';
import { YOUTUBE_SOCKET_PATH } from '@src/config';

export default function (server: Server) {
  createSocket(server, YOUTUBE_SOCKET_PATH);
}
