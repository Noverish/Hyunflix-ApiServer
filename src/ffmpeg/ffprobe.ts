import * as subprocess from '@src/utils/subprocess';

export interface FFProbeVideo {
  duration: number;
  frame: number;
  width: number;
  height: number;
}

export interface FFProbeAudio {
  duration: number;
}

export async function ffprobeVideo(path: string): Promise<FFProbeVideo> {
  const result = await subprocess.simple('ffprobe', [
    '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', path
  ])
  
  const info = JSON.parse(result)
  const stream = info['streams'].find(s => s['codec_type'] === 'video');

  return {
    duration: parseFloat(stream['duration']),
    frame: parseInt(stream['nb_frames']),
    width: parseInt(stream['width']),
    height: parseInt(stream['height']),
  };
}

export async function ffprobeAudio(path: string): Promise<FFProbeAudio> {
  const result = await subprocess.simple('ffprobe', [
    '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', path
  ])
  
  const info = JSON.parse(result)
  const stream = info['streams'][0];

  return {
    duration: parseFloat(stream['duration'])
  };
}