import { subprocess } from 'src/utils';
import { VideoInfo } from './';

export default async function (path: string): Promise<VideoInfo> {
  
  // ffprobe -v quiet -print_format json -show_format -show_streams "lolwut.mp4" > "lolwut.mp4.json"
  const result = await subprocess.simple('ffprobe', [
    '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', path  
  ])
  
  const info = JSON.parse(result)
  const videoStream = info['streams'][0];

  return {
    duration: parseFloat(videoStream['duration']),
    frame: parseInt(videoStream['nb_frames']),
  };
}

