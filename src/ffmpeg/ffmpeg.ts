import { spawn } from 'child_process';

export interface FFMpegStatus {
  frame: number;
  fps: number;
  q: number;
  size: number;
  time: string;
  bitrate: number;
  speed: number;
}

export function pass1(path, callback: (FFMpegStatus) => void) {
  const args = [
    '-i', path,
    '-c:v', 'libx264',
    '-b:v', '2000k',
    '-pass', '1',
    '-vf', 'scale=1280:-2',
    '-map_chapters', '-1',
    '-f', 'mp4',
    '-an', '-y',
    '/dev/null',
  ];
  
  return ffmpegPromise(args, callback);
}

export function pass2(path, outpath, callback: (FFMpegStatus) => void) {
  const args = [
    '-i', path,
    '-c:v', 'libx264',
    '-b:v', '2000k',
    '-pass', '2',
    '-vf', 'scale=1280:-2',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ac', '2',
    '-map_chapters', '-1',
    '-y',
    outpath,
  ];
  
  return ffmpegPromise(args, callback);
}

export function mkv2mp4(path: string, outpath: string, callback: (FFMpegStatus) => void): Promise<void> {
  const args = [
    '-i', path,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ac', '2',
    '-map_chapters', '-1',
    '-y',
    outpath,
  ];
  
  return ffmpegPromise(args, callback);
}

function ffmpegPromise(args: string[], callback: (FFMpegStatus) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    
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

function extract(data: string): FFMpegStatus | null {
  try {
    const regex = /frame=[ \d]* fps=[ \d]* q=[ .-\d]* L?size=[ \d]*kB time=[:.\d]* bitrate=[.\d]*kbits\/s speed=[.\d]*x/;
    const matched: string = data.match(regex)[0];

    const frameMatched = matched.match(/frame=[ \d]*/);
    const fpsMatched = matched.match(/fps=[ \d]*/);
    const qMatched = matched.match(/q=[ .-\d]*/);
    const sizeMatched = matched.match(/size=[ \d]*kB/);
    const timeMatched = matched.match(/time=[:.\d]*/)[0];
    const bitrateMatched = matched.match(/bitrate=[.\d]*kbits\/s/)[0];
    const speedMatched = matched.match(/speed=[.\d]*x/)[0];

    const frameString = frameMatched[0].match(/[\d]+/)[0];
    const fpsString = fpsMatched[0].match(/[\d]+/)[0];
    const qString = qMatched[0].match(/[.-\d]+/)[0];
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
