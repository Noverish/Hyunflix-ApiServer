export interface EncodingStatus {
  frame: number;
  fps: number;
  q: number;
  size: number;
  time: string;
  bitrate: number;
  speed: number;
}



import * as _ffmpeg from './ffmpeg';
export const ffmpeg = _ffmpeg;

export { default as ffprobe, FFProbe } from './ffprobe';
