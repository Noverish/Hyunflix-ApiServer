import { promises as fsPromises } from 'fs';
import { join, extname, dirname, parse } from 'path';

export async function walk(path): Promise<string[]> {
  const toGoList: string[] = [path];
  const filePaths: string[] = [];
  
  while(toGoList.length > 0) {
    const dirPath = toGoList.shift();
    const files = (await fsPromises.readdir(dirPath)).sort();
    for(const file of files) {
      const filePath = join(dirPath, file);
      const stat = await fsPromises.stat(filePath);
      if (stat.isDirectory()) {
        toGoList.push(filePath);
      } else if(stat.isFile()) {
        filePaths.push(filePath);
      }
    }
  }
  
  return filePaths;
}

export async function walkDir(path): Promise<string[]> {
  const toGoList = [path];
  const dirList = [path];
  
  while(toGoList.length > 0) {
    const dirPath = toGoList.shift();
    const files = (await fsPromises.readdir(dirPath)).sort();
    for(const file of files) {
      const filePath = join(dirPath, file);
      const stat = await fsPromises.stat(filePath);
      if(stat.isDirectory()) {
        dirList.push(filePath);
        toGoList.push(filePath);
      }
    }
  }
  
  return dirList
}

export interface Subtitle {
  language: string;
  path: string;
}

export async function findSubtitle(videoPath: string): Promise<Subtitle[]> {
  if(extname(videoPath) !== '.mp4') {
    throw new Error(`'${videoPath}' is not mp4`);
  }
  
  const dirPath = dirname(videoPath);
  const files = await fsPromises.readdir(dirPath);
  const subtitles: Subtitle[] = [];
  
  for (const file of files) {
    const { name, ext } = parse(file);
    
    if (name === parse(videoPath).name && (ext === '.smi' || ext === '.srt')) {
      subtitles.push({
        language: 'ko',
        path: join(dirPath, `${name}.vtt`),
      })
    }
  }
  
  // There is no subtitle file which name is same as video name
  if(subtitles.length === 0) {
    for (const file of files) {
      const { name, ext } = parse(file);
      if (ext === '.smi' || ext === '.srt') {
        subtitles.push({
          language: name,
          path: join(dirPath, `${name}.vtt`),
        });
      }
    }
  }
  
  return subtitles;
}