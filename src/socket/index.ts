import * as WebSocket from 'ws';
import { Server, IncomingMessage } from 'http';

import { UserVideoService } from '@src/services';

export default function (server: Server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    console.log(`[Socket] Connected ${req.socket.remoteAddress}`);

    ws.on('message', (data: WebSocket.Data) => {
      const payload = JSON.parse(data.toString());
      UserVideoService.update(payload).catch(console.error);
    });
  });
}
