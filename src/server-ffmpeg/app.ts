import { join, basename } from 'path';
import * as fs from 'fs';

import { ffprobe, ffmpeg, VideoInfo, EncodingStatus } from 'src/ffmpeg';
import { Encode } from 'src/entity';

async function encodeIfExists() {
  const queuedList: Encode[] = await Encode.findNotDone();

  if (queuedList.length > 0) {
    const queued = queuedList[0];
    const path = join('/archive', queued.target);
    const outpath = path + '.mp4';
    const info: VideoInfo = await ffprobe(path);

    await ffmpeg.pass1(path, (status: EncodingStatus) => {
      const progress = status.frame / info.frame * 50;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.target), progress);
    });

    await ffmpeg.pass2(path, outpath, (status: EncodingStatus) => {
      const progress = status.frame / info.frame * 50 + 50;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.target), progress);
    });

    fs.unlinkSync(path);
    fs.renameSync(outpath, path);
  }

  setTimeout(encodeIfExists, 1000);
}

setTimeout(encodeIfExists, 1000);
