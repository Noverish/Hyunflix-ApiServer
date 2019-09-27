import { parse, dirname, extname, basename, join } from 'path';
import { promises as fsPromises } from 'fs';

import { FILE_SERVER } from '@src/config';
import { ffprobeVideo, FFProbeVideo } from '@src/utils/ffprobe';

export interface VideoSubtitle {
  language: string;
  url: string;
}

export interface VideoSrc {
  resolution: string;
  width: number;
  height: number;
  url: string;
}

export interface Video {
  title: string;
  subtitles: VideoSubtitle[];
  srcs: VideoSrc[];
  thumbnailUrl: string | null;
  date: string;
  duration: number;
}

export async function getVideoFromFilePath(videoPath: string, root: string) {
  const realVideoPath = join(root, videoPath);

  if (extname(videoPath) !== '.mp4') {
    throw new Error(`'${videoPath}' is not mp4`);
  }

  const dirPath = dirname(videoPath);
  const realDirPath = dirname(realVideoPath);
  const dirName = basename(realDirPath);
  const files = await fsPromises.readdir(realDirPath);
  const probed: FFProbeVideo = await ffprobeVideo(realVideoPath);

  const video: Video = {
    title: dirName + ' ' + basename(videoPath),
    subtitles: [],
    srcs: [{
      resolution: '',
      width: probed.width,
      height: probed.height,
      url: FILE_SERVER + videoPath,
    }],
    thumbnailUrl: null,
    date: '1970-01-01 00:00:00',
    duration: probed.duration,
  };

  for (const file of files) {
    const { base, name, ext } = parse(file);

    if (name === 'thumbnail') {
      video.thumbnailUrl = FILE_SERVER + join(dirPath, base);
    }

    if (name === parse(videoPath).name && (ext === '.smi' || ext === '.srt')) {
      video.subtitles.push({
        language: 'ko',
        url: FILE_SERVER + join(dirPath, `${name}.vtt`),
      });
    }
  }

  // There is no subtitle file which name is same as video name
  if (video.subtitles.length === 0) {
    for (const file of files) {
      const { base, name, ext } = parse(file);
      if (ext === '.smi' || ext === '.srt') {
        video.subtitles.push({
          language: name,
          url: FILE_SERVER + join(dirPath, `${name}.vtt`),
        });
      }
    }
  }

  return video;
}

export async function getVideoFromDirPath(dirPath: string, root: string) {
  const realDirPath = join(root, dirPath);
  const dirName = basename(dirPath);
  const files = await fsPromises.readdir(realDirPath);

  const video: Video = {
    title: dirName,
    subtitles: [],
    srcs: [],
    thumbnailUrl: null,
    date: '1970-01-01 00:00:00',
    duration: 0,
  };

  for (const file of files) {
    const { base, name, ext } = parse(file);

    if (name === 'thumbnail') {
      video.thumbnailUrl = FILE_SERVER + join(dirPath, base);
    }

    if (ext === '.smi' || ext === '.srt') {
      video.subtitles.push({
        language: name,
        url: FILE_SERVER + join(dirPath, `${name}.vtt`),
      });
    }

    if (ext === '.mp4') {
      const filePath = join(dirPath, base);
      const realFilePath = join(root, filePath);
      const probed: FFProbeVideo = await ffprobeVideo(realFilePath);

      video.srcs.push({
        resolution: name,
        url: FILE_SERVER + filePath,
        width: probed.width,
        height: probed.height,
      });
      video.duration = probed.duration;
    }
  }

  return video;
}
