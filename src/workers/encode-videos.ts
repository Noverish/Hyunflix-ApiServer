import { parse } from 'path';
import { Between } from 'typeorm';

import { FFMPEG_SOCKET_PATH } from '@src/config';
import { FFMpegStatus } from '@src/models';
import { Encode } from '@src/entity';
import { ffmpeg, ffprobeVideo, unlink, rename } from '@src/rpc';
import { send } from '@src/sockets';

let isWorking = false;

export default async function () {
  if (isWorking) {
    return;
  }
  isWorking = true;

  while (true) {
    const encode: Encode | undefined = await Encode.findOne({ progress: Between(0, 99) });

    if (!encode) {
      isWorking = false;
      return;
    }

    await encodeVideo(encode);
  }
}

async function encodeVideo(encode: Encode) {
  const args: string[] = encode.options.split(' ');
  const inpath: string = encode.inpath;
  const outpath: string = (inpath === encode.outpath)
    ? `${parse(inpath).dir}/${parse(inpath).name}.tmp.mp4`
    : encode.outpath;

  const newArgs = ['-i', inpath, ...args, outpath].filter(v => !!v);

  const { duration } = await ffprobeVideo(inpath);

  try {
    await ffmpeg(newArgs, (status: FFMpegStatus) => {
      const progress = parseFloat((status.time / duration * 100).toFixed(2));
      const etaRaw = (duration - status.time) / status.speed;
      const eta = parseFloat(etaRaw.toFixed(1));

      Encode.update(encode.id, { progress });

      send(FFMPEG_SOCKET_PATH, {
        eta,
        progress,
        speed: status.speed,
        encodeId: encode.id,
      });
    });

    if (encode.inpath === encode.outpath) {
      await unlink(inpath);
      await rename(outpath, inpath);
    }
  } catch (err) {
    Encode.update(encode.id, { progress: -1 });
    console.error(err.message);

    send(FFMPEG_SOCKET_PATH, {
      eta: 0,
      progress: -1,
      speed: 0,
      encodeId: encode.id,
    });
  }
}
