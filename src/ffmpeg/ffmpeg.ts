import { spawn } from 'child_process';
import { EncodingStatus } from './';

export function pass1(path, callback: (EncodingStatus) => void) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', path,
      '-c:v', 'libx264',
      '-b:v', '2000k',
      '-pass', '1',
      '-vf', 'scale=1280:-2',
      '-f', 'mp4',
      '-an', '-y',
      '/dev/null',
    ]);

    ffmpeg.stdout.on('data', (data) => {
      const status = extract(data.toString());
      if (status) {
        callback(status);
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      const status = extract(data.toString());
      if (status) {
        callback(status);
      }
    });

    ffmpeg.on('close', () => {
      resolve();
    });
  });
}

export function pass2(path, outpath, callback: (EncodingStatus) => void) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', path,
      '-c:v', 'libx264',
      '-b:v', '2000k',
      '-pass', '2',
      '-vf', 'scale=1280:-2',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ac', '2',
      '-y',
      outpath,
    ]);

    ffmpeg.stdout.on('data', (data) => {
      const status = extract(data.toString());
      if (status) {
        callback(status);
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      const status = extract(data.toString());
      if (status) {
        callback(status);
      }
    });

    ffmpeg.on('close', () => {
      resolve();
    });
  });
}

function extract(data: string): EncodingStatus | null {
  try {
    const regex = /frame=[ \d]* fps=[ \d]* q=[ .\d]* size=[ \d]*kB time=[:.\d]* bitrate=[.\d]*kbits\/s speed=[.\d]*x/;
    const matched: string = data.match(regex)[0];

    const frameMatched = matched.match(/frame=[ \d]*/);
    const fpsMatched = matched.match(/fps=[ \d]*/);
    const qMatched = matched.match(/q=[ .\d]*/);
    const sizeMatched = matched.match(/size=[ \d]*kB/);
    const timeMatched = matched.match(/time=[:.\d]*/)[0];
    const bitrateMatched = matched.match(/bitrate=[.\d]*kbits\/s/)[0];
    const speedMatched = matched.match(/speed=[.\d]*x/)[0];

    const frameString = frameMatched[0].match(/[\d]+/)[0];
    const fpsString = fpsMatched[0].match(/[\d]+/)[0];
    const qString = qMatched[0].match(/[.\d]+/)[0];
    const sizeString = sizeMatched[0].match(/[.\d]+/)[0];
    const timeString = timeMatched.match(/[:.\d]+/)[0];
    const bitrateString = bitrateMatched.match(/[.\d]+/)[0];
    const speedString = speedMatched.match(/[.\d]+/)[0];

    return {
      frame: parseInt(frameString),
      fps: parseInt(fpsString),
      q: parseFloat(qString),
      size: parseInt(sizeString),
      time: timeString,
      bitrate: parseFloat(bitrateString),
      speed: parseFloat(speedString),
    };
  } catch (err) {
    return null;
  }
}
