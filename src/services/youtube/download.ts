import { parse, format } from 'path';
import { parse as urlParse } from 'url';
import { parse as queryParse } from 'querystring';

import { Music } from '@src/entity';
import { downloadYoutube, ffmpeg, unlink, ffprobeMusic } from '@src/rpc';
import { YoutubeStatus, FFMpegStatus, FFProbeMusic, YoutubeSSEStatus, YoutubeSSEStage } from '@src/models';
import { SSEService } from '@src/services';

const SSE_PATH = '/youtube';

export default async function (url: string, tags: string[]) {
  let stage: YoutubeSSEStage = YoutubeSSEStage.download;

  try {
    const path: string | null = await downloadYoutube(url, (status: YoutubeStatus) => {
      const { progress, eta } = status;
      sseSend({ stage, progress, eta, error: null });
    });

    const inpath = path;
    const { dir, name } = parse(inpath);
    const outpath = format({ dir, name, ext: '.mp3' });
    const args = ['-y'];

    stage = YoutubeSSEStage.encode;

    await ffmpeg(inpath, outpath, args, (status: FFMpegStatus) => {
      const { progress, eta } = status;
      sseSend({ stage, progress, eta, error: null });
    });

    await unlink(inpath);

    const title: string = name;
    const youtube: string = queryParse(urlParse(url).query)['v'].toString();

    const { duration }: FFProbeMusic = await ffprobeMusic(outpath);

    await Music.insert({
      title,
      duration,
      youtube,
      path: outpath,
      tags: tags.join(','),
      authority: '',
    });

    stage = YoutubeSSEStage.finish;

    sseSend({ stage, progress: 100, eta: 0, error: null });
  } catch (err) {
    sseSend({ stage, progress: 0, eta: 0, error: err.stack });
  }
}

function sseSend(status: YoutubeSSEStatus) {
  SSEService.send(SSE_PATH, status);
}
