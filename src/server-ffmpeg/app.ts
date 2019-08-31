import { join, basename, parse } from 'path';
import { createConnection } from 'typeorm';
import * as socketio from 'socket.io-client';
import * as fs from 'fs';

import { ffprobeVideo, FFProbeVideo } from '@src/utils/ffprobe';
import { FFMpegStatus, default as ffmpeg } from '@src/utils/ffmpeg';
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
    
    const args: string[] = queued.options.split(' ');
    const inpath: string = queued.inpath;
    const outpath: string = (inpath === queued.outpath)
      ? parse(inpath).dir + '/' + parse(inpath).name + '.tmp.mp4'
      : queued.outpath;
    
    const probed: FFProbeVideo = await ffprobeVideo(inpath);
    
    const newArgs = ['-i', inpath, ...args, outpath];
    
    await ffmpeg(newArgs, (status: FFMpegStatus) => {
      const progress = status.frame / probed.frame * 100;
      Encode.updateProgress(queued._id, progress);
      console.log(new Date().toLocaleString(), basename(queued.inpath), progress);
      const payload = {
        _id: queued._id,
        progress: progress
      }
      socket.send(JSON.stringify(payload));
    })

    Encode.updateProgress(queued._id, 100);
    
    if(queued.inpath === queued.outpath) {
      fs.unlinkSync(outpath);
      fs.renameSync(outpath, inpath);
    }
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

