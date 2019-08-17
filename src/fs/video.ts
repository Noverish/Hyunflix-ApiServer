import { parse, dirname, extname, basename, join } from 'path';
import * as fs from 'fs';

import { ffprobe, FFProbe } from '@src/ffmpeg'

export interface VideoSubtitle {
  language: string;
  path: string;
}

export interface VideoSrc {
  resolution: string;
  width: number;
  height: number;
  path: string;
}

export interface Video {
  title: string;
  subtitles: VideoSubtitle[];
  srcs: VideoSrc[];
  thumbnail: string | null;
  date: string;
  duration: number;
}

export async function getVideoFromFilePath(videoPath: string) {
  if(extname(videoPath) !== '.mp4') {
    throw new Error(`'${videoPath}' is not mp4`);
  }
  
  const dirPath = dirname(videoPath);
  const dirName = basename(dirPath);
  const files = fs.readdirSync(dirPath);
  const probed: FFProbe = await ffprobe(videoPath);
  
  const video: Video = {
    title: dirName + ' ' + basename(videoPath),
    subtitles: [],
    srcs: [{
      resolution: '',
      path: videoPath,
      width: probed.width,
      height: probed.height,
    }],
    thumbnail: null,
    date: '1970-01-01 00:00:00',
    duration: probed.duration,
  }
  
  for (const file of files) {
    const { base, name, ext } = parse(file);

    if (name === 'thumbnail') {
      video.thumbnail = join(dirPath, base);
    }
    
    if (name === parse(videoPath).name && (ext === '.smi' || ext === '.srt')) {
      video.subtitles.push({
        language: 'ko',
        path: join(dirPath, `${name}.vtt`),
      })
    }
  }
  
  // There is no subtitle file which name is same as video name
  if(video.subtitles.length === 0) {
    for (const file of files) {
      const { base, name, ext } = parse(file);
      if (ext === '.smi' || ext === '.srt') {
        video.subtitles.push({
          language: name,
          path: join(dirPath, `${name}.vtt`),
        });
      }
    }
  }
  
  return video;
}

export async function getVideoFromDirPath(dirPath: string) {
  const dirName = basename(dirPath);
  const files = fs.readdirSync(dirPath);
  
  const video: Video = {
    title: dirName,
    subtitles: [],
    srcs: [],
    thumbnail: null,
    date: '1970-01-01 00:00:00',
    duration: 0,
  }

  for (const file of files) {
    const { base, name, ext } = parse(file);

    if (name === 'thumbnail') {
      video.thumbnail = join(dirPath, base);
    }

    if (ext === '.smi' || ext === '.srt') {
      video.subtitles.push({
        language: name,
        path: join(dirPath, `${name}.vtt`),
      });
    }

    if (ext === '.mp4') {
      const filePath = join(dirPath, base);
      const probed: FFProbe = await ffprobe(filePath);
      
      video.srcs.push({
        resolution: name,
        path: filePath,
        width: probed.width,
        height: probed.height
      });
      video.duration = probed.duration;
    }
  }

  return video;
}