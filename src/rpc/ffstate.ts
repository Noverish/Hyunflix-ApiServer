import { call } from './';

export function ffmpegExist(): Promise<boolean> {
  return call('ffmpegExist', undefined);
}

export function ffmpegState(): Promise<boolean> {
  return call('ffmpegState', undefined);
}

export function ffmpegPause(): Promise<void> {
  return call('ffmpegPause', undefined);
}

export function ffmpegResume(): Promise<void> {
  return call('ffmpegResume', undefined);
}