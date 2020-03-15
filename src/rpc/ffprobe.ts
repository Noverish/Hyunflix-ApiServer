import { FFProbeVideo, FFProbeMusic } from '@src/models';
import { call } from '.';

export function ffprobeVideo(path: string): Promise<FFProbeVideo> {
  return call('ffprobeVideo', { path });
}

export function ffprobeMusic(path: string): Promise<FFProbeMusic> {
  return call('ffprobeMusic', { path });
}
