export * from './video';

export interface ISubtitle {
  language: string;
  url: string;
}

export interface RawSubtitle {
  language: string;
  path: string;
}

export interface IMusic {
  id: number;
  title: string;
  path: string;
  url: string;
  duration: number;
  youtube: string | null;
  tags: string[];
}

export interface Stat {
  path: string;
  name: string;
  size: number;
  isdir: boolean;
}

export interface File {
  url: string;
  path: string;
  name: string;
  isdir: boolean;
  size: string;
}

export interface FFProbe {
  duration: number;
  bitrate: number;
  size: number;
}

export interface FFProbeVideo extends FFProbe {
  width: number;
  height: number;
}

export interface FFProbeMusic extends FFProbe {

}

export interface FFMpegStatus {
  frame: number;
  fps: number;
  q: number;
  size: number;
  time: number;
  bitrate: number;
  speed: number;
  progress: number;
  eta: number;
}

export interface Auth {
  id: number;
  token: string;
  authority: string[];
  allowedPaths: string[];
}

export interface IEncode {
  id: number;
  inpath: string;
  outpath: string;
  options: string;
  progress: number;
  date: string;
}

export interface YoutubeStatus {
  progress: number;
  total: number;
  speed: number;
  eta: number;
}

export interface YoutubeSSEStatus {
  stage: YoutubeSSEStage;
  progress: number;
  eta: number;
  error: string | null;
}

export enum YoutubeSSEStage {
  download = 0,
  encode = 1,
  finish = 2,
}
