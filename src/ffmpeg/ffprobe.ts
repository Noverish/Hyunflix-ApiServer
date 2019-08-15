const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

import { VideoInfo } from './';

export default async function (path: string): Promise<VideoInfo> {
  const info = await ffprobe(path, { path: ffprobeStatic.path });
  const videoStream = info['streams'][0];

  return {
    duration: parseFloat(videoStream['duration']),
    frame: parseInt(videoStream['nb_frames']),
  };
}

// ffprobe -v quiet -print_format json -show_format -show_streams "lolwut.mp4" > "lolwut.mp4.json"
