import * as fs from 'promise-fs';
import * as prettyBytes from 'pretty-bytes';
import { Type, File, Video, Image, Text } from '../models';
import { join, dirname, extname, basename, parse } from 'path';

const SERVER = 'home.hyunsub.kim:8080';

export function getType(ext: string): Type {
  switch (ext.toLowerCase()) {
    case '.mp4':
      return Type.video
    case '.vtt':
    case '.srt':
    case '.smi':
    case '.txt':
      return Type.text
    case '.jpg':
    case '.jpeg':
    case '.png':
      return Type.image
  }
}

export async function getFileList(stat: fs.stat, path: string): Promise<File[]> {
  const files = await fs.readdir(path, { withFileTypes: true });
  const results: File[] = [];
  
  for(const f of files) {
    const isDir = f.isDirectory();
    const filePath = join(path, f.name)
    
    if(isDir) {
      const file: File = {
        name: f.name,
        type: Type.folder,
        path: filePath,
        isDir: isDir,
        size: null,
      }
      
      results.push(file);
    } else {
      const parsed = parse(filePath);
      const stat = fs.statSync(filePath);
      
      results.push({
        name: parsed.base,
        type: Type.parse(parsed.ext),
        path: filePath,
        isDir: isDir,
        size: prettyBytes(stat.size),
      });
    }
  }
  
  return results;
}

export async function getVideo(stat: fs.stat, path: string): Promise<Video> {
  const parsed = parse(path);
  
  const posterPath = join(parsed.dir, parsed.name + '.jpg');
  const vttPath = join(parsed.dir, parsed.name + '.vtt');
  const smiPath = join(parsed.dir, parsed.name + '.smi');
  
  return {
    posterUrl: (await isExist(posterPath)) ? ('http://' + join(SERVER, posterPath) + '?raw') : null,
    videoUrl: 'http://' + join(SERVER, path) + '?raw',
    subtitleUrl: (await isExist(smiPath)) ? ('http://' + join(SERVER, vttPath) + '?raw') : null,
    videoWidth: 640,
    videoHeight: 360
  };
}

export async function getImage(stat: fs.stat, path: string): Promise<Image> {
  const url = 'http://' + join(SERVER, path) + '?raw'
  
  return {
    rawUrl: url
  }
}

export async function getText(stat: fs.stat, path: string): Promise<Text> {
  const url = 'http://' + join(SERVER, path) + '?raw'
  
  return {
    rawUrl: url
  }
}

async function isExist(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch(err) {
    return false;
  }
}