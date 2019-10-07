import { Server } from 'http';

import { createSocket, setReceiveListener } from '@src/sockets';
import { USER_VIDEO_SOCKET_PATH } from '@src/config';
import { UserVideoTime } from '@src/models';
import { UserVideo } from '@src/entity';

export default function (server: Server) {
  createSocket(server, USER_VIDEO_SOCKET_PATH);
  setReceiveListener(USER_VIDEO_SOCKET_PATH, receive);
}

function receive(payload: UserVideoTime) {
  (async function () {
    const { userId, articleId, time } = payload;
    
    const userVideo: UserVideo | null = await UserVideo.find(userId, articleId);
    
    if (!userVideo) {
      await UserVideo.insert(userId, articleId);
    }
    
    await UserVideo.update(userId, articleId, time);
  })().catch(console.error);
}