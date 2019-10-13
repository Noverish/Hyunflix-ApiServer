import { Server } from 'http';

import { createSocket } from '@src/sockets';
import { VIDEO_EXAMINE_SOCKET_PATH } from '@src/config';

export default function (server: Server) {
  createSocket(server, VIDEO_EXAMINE_SOCKET_PATH);
}
