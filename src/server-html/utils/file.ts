import * as fs from 'promise-fs';
import * as prettyBytes from 'pretty-bytes';
import { File, Video } from '../models';
import { join, extname, basename, parse } from 'path';

export async function getFileList(path: string): Promise<File[]> {
  try {
    await fs.access(path);
  } catch (err) {
    throw { status: 400, msg: 'Not Existing Folder' };
  }

  const stat = await fs.stat(path);
  if (stat.isFile()) {
    throw { status: 400, msg: 'This is File Not Folder' };
  }

  const files = await fs.readdir(path, { withFileTypes: true });
  const results: File[] = [];

  for (const f of files) {
    const isDir = f.isDirectory();
    const filePath = join(path, f.name);

    if (isDir) {
      const file: File = {
        name: f.name,
        path: filePath,
        isDirectory: isDir,
        size: null,
        displayName: f.name + '/',
        displaySize: null,
      };

      results.push(file);
    } else {
      const stat = fs.statSync(filePath);

      const file: File = {
        name: f.name,
        path: filePath,
        isDirectory: isDir,
        size: stat.size,
        displayName: f.name,
        displaySize: prettyBytes(stat.size),
      };

      results.push(file);
    }
  }

  return results;
}

export async function getVideoInfo(path: string): Promise<Video> {
  const { root, dir, base, ext, name } = parse(path);

  const video: Video = {
    name: base,
    posterUrl: '',
    videoUrl: `${path}?raw`,
    subtitleUrl: await getSubtitlePath(path),
    videoWidth: 640,
    videoHeight: 320,
  };

  return video;
}

async function getSubtitlePath(videoPath: string): Promise<string | null> {
  const folderPath = parse(videoPath).dir;
  const videoName = parse(videoPath).name;
  const smiBase = `${videoName}.smi`;
  const srtBase = `${videoName}.srt`;

  const fileList = await fs.readdir(folderPath);
  for (const fileBase of fileList) {
    const fileName = parse(fileBase).name;
    if (fileBase === 'ko.smi' || fileBase === 'ko.srt') {
      return join(folderPath, 'ko.vtt?raw');
    }

    if (fileBase === smiBase || fileBase === srtBase) {
      return join(folderPath, `${fileName}.vtt?raw`);
    }
  }

  return null;
}
