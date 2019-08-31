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
  const format = info['format'];
  
  const tmp = stream['avg_frame_rate'].split('/');
  const avgFrameRate = parseInt(tmp[0]) / parseInt(tmp[1]);
  const duration = parseFloat(stream['duration'] || format['duration']);
  const frame = parseInt(stream['nb_frames']) || (duration * avgFrameRate);
  
  return {
    duration: duration,
    frame: frame,
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