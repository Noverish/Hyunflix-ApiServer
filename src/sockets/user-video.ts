import { Server } from 'http';

import { createSocket, setReceiveListener } from '@src/sockets';
import { USER_VIDEO_SOCKET_PATH } from '@src/config';
import { UserVideoTime } from '@src/models';
import { UserVideo, Video } from '@src/entity';

export default function (server: Server) {
  createSocket(server, USER_VIDEO_SOCKET_PATH);
  setReceiveListener(USER_VIDEO_SOCKET_PATH, receive);
}

function receive(payload: UserVideoTime) {
  (async function () {
    const { userId, videoId, time } = payload;

    if (time === 0) {
      return;
    }

    const video = await Video.findOne({ id: videoId });
    const userVideo: UserVideo | null = await UserVideo.$findOne({ userId, video });

    if (!userVideo) {
      await UserVideo.insert({ userId, video });
    } else {
      await UserVideo.update({ userId, video }, { time });
    }
  })().catch(console.error);
}
