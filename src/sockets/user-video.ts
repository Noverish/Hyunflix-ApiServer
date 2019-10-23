import { Server } from 'http';

import { createSocket, setReceiveListener } from '@src/sockets';
import { USER_VIDEO_SOCKET_PATH } from '@src/config';
import { UserVideoTime } from '@src/models';
import { UserVideo, VideoArticle } from '@src/entity';

export default function (server: Server) {
  createSocket(server, USER_VIDEO_SOCKET_PATH);
  setReceiveListener(USER_VIDEO_SOCKET_PATH, receive);
}

function receive(payload: UserVideoTime) {
  (async function () {
    const { userId, articleId, time } = payload;

    if (time === 0) {
      return;
    }

    const article = await VideoArticle.findById(articleId);
    const userVideo: UserVideo | null = await UserVideo.$findOne({ userId, article });

    if (!userVideo) {
      await UserVideo.insert({ userId, article });
    } else {
      await UserVideo.update({ userId, article }, { time });
    }
  })().catch(console.error);
}
