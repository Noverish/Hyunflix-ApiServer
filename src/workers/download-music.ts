import { extname, basename } from 'path';
import { parse as urlParse } from 'url';
import { parse as queryParse } from 'querystring';

import { Music } from '@src/entity';
import { YOUTUBE_SOCKET_PATH, ARCHIVE_PATH } from '@src/config';
import { downloadYoutube, ffprobeMusic, ffmpeg, unlink } from '@src/rpc';
import { send } from '@src/sockets';
import { YoutubeStage, YoutubeStatus, IYoutubeStatus, FFProbeMusic, FFMpegStatus } from '@src/models';

let status: IYoutubeStatus = {
  stage: YoutubeStage.ready,
  progress: 0,
  eta: 0,
  error: null,
};

export default async function (url: string, tags: string[]) {
  try {

    // Download
    updateYoutubeStatus({ stage: YoutubeStage.download });

    const path: string | null = await downloadYoutube(url, (status: YoutubeStatus) => {
      const { progress, eta } = status;
      updateYoutubeStatus({ progress, eta });
    });

    // Encode
    updateYoutubeStatus({ stage: YoutubeStage.encode });

    const inpath = path;
    const outpath = inpath.replace(extname(inpath), '.mp3');
    const args = ['-i', inpath, '-y', outpath];

    const { duration }: FFProbeMusic = await ffprobeMusic(inpath);

    await ffmpeg(args, (status: FFMpegStatus) => {
      const progress = parseFloat((status.time / duration * 100).toFixed(2));
      const etaRaw = (duration - status.time) / status.speed;
      const eta = parseFloat(etaRaw.toFixed(1));

      updateYoutubeStatus({ progress, eta });
    });

    await unlink(inpath);

    const title = basename(inpath, extname(inpath));
    const youtube = queryParse(urlParse(url).query)['v'].toString();

    await Music.insert({
      title,
      duration,
      youtube,
      path: outpath.replace(ARCHIVE_PATH, ''),
      tags: tags.join(','),
      authority: '',
    });

    // success
    updateYoutubeStatus({ stage: YoutubeStage.success });
  } catch (err) {
    console.log(err);
    updateYoutubeStatus({ error: err.toString() });
  }
}

function updateYoutubeStatus(partial: Partial<IYoutubeStatus>) {
  if (partial.hasOwnProperty('stage')) {
    status = { stage: partial.stage, progress: 0, eta: 0, error: null };
  } else {
    status = { ...status, ...partial };
  }
  send(YOUTUBE_SOCKET_PATH, status);
}
