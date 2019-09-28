import { promises as fsPromises } from 'fs';
import { join, extname, dirname, parse, relative } from 'path';

import { ISubtitle } from '@src/models';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

export async function findSubtitle(videoPath: string): Promise<ISubtitle[]> {
  if (extname(videoPath) !== '.mp4') {
    throw new Error(`'${videoPath}' is not mp4`);
  }

  const dirPath = dirname(videoPath);
  const files = await fsPromises.readdir(dirPath);
  const subtitles: ISubtitle[] = [];

  for (const file of files) {
    const { name, ext } = parse(file);

    if (name === parse(videoPath).name && (ext === '.smi' || ext === '.srt')) {
      subtitles.push({
        language: 'ko',
        url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, join(dirPath, `${name}.vtt`)),
      });
    }
  }

  // There is no subtitle file which name is same as video name
  if (subtitles.length === 0) {
    for (const file of files) {
      const { name, ext } = parse(file);
      if (ext === '.smi' || ext === '.srt') {
        subtitles.push({
          language: name,
          url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, join(dirPath, `${name}.vtt`)),
        });
      }
    }
  }

  return subtitles;
}
