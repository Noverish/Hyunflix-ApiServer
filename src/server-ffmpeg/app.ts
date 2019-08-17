import { join, basename, parse } from 'path';
import * as fs from 'fs';

import { ffprobe, ffmpeg, FFProbe, EncodingStatus } from 'src/ffmpeg';
import { Encode } from 'src/entity';

async function encodeIfExists() {
  const queuedList: Encode[] = await Encode.findNotDone();

  if (queuedList.length > 0) {
    const queued = queuedList[0];
    const path = join('/archive', queued.target);
    const parsed = parse(path);
    const outpath = parsed.dir + '/' + parsed.name + '.mp4';
    const tmppath = parsed.dir + '/' + parsed.name + '.tmp.mp4';
    const probed: FFProbe = await ffprobe(path);

    await ffmpeg.pass1(path, (status: EncodingStatus) => {
      const progress = status.frame / probed.frame * 50;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.target), progress);
    });

    await ffmpeg.pass2(path, tmppath, (status: EncodingStatus) => {
      const progress = status.frame / probed.frame * 50 + 50;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.target), progress);
    });

    fs.unlinkSync(path);
    fs.renameSync(tmppath, outpath);
  }

  setTimeout(encodeIfExists, 1000);
}

setTimeout(encodeIfExists, 1000);
