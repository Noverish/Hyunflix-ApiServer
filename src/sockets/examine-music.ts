import { Server } from 'http';

import { createSocket } from '@src/sockets';
import { MUSIC_EXAMINE_SOCKET_PATH } from '@src/config';

export default function (server: Server) {
  createSocket(server, MUSIC_EXAMINE_SOCKET_PATH);
}
