import { join, basename, parse } from 'path';
import { createConnection } from 'typeorm';
import * as socketio from 'socket.io-client';
import * as fs from 'fs';

import { ffprobeVideo, FFProbeVideo, FFMpegStatus, pass1, pass2 } from '@src/ffmpeg';
import { Encode } from '@src/entity';

const socket = socketio.connect("http://localhost:8080", { path: '/socket.io/ffmpeg' });

socket.on('connect_error', () => {
  console.log(new Date().toLocaleString(), 'connect_error');
});

socket.on('reconnect_failed', () => {
  console.log(new Date().toLocaleString(), 'reconnect_failed');
});

async function encodeIfExists() {
  const queuedList: Encode[] = await Encode.findNotDone();

  if (queuedList.length > 0) {
    const queued = queuedList[0];
    const path = join(queued.target);
    const parsed = parse(path);
    const outpath = parsed.dir + '/' + parsed.name + '.mp4';
    const tmppath = parsed.dir + '/' + parsed.name + '.tmp.mp4';
    const probed: FFProbeVideo = await ffprobeVideo(path);

    await pass1(path, (status: FFMpegStatus) => {
      const progress = status.frame / probed.frame * 50;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.target), progress);
      
      const payload = {
        _id: queued._id,
        progress: progress
      }
      socket.send(JSON.stringify(payload));
    });

    await pass2(path, tmppath, (status: FFMpegStatus) => {
      const progress = status.frame / probed.frame * 50 + 50;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.target), progress);
      
      const payload = {
        _id: queued._id,
        progress: progress
      }
      socket.send(JSON.stringify(payload));
    });

    fs.unlinkSync(path);
    fs.renameSync(tmppath, outpath);
  }

  setTimeout(encodeIfExists, 1000);
}

async function main() {
  console.log('* FFMpeg Server Started!')
  await createConnection();
  
  setTimeout(encodeIfExists, 1000);
}

main().catch(err =>{
  console.error(err);
})

