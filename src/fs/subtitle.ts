import { promises as fsPromises } from 'fs';
import { join, extname, dirname, parse } from 'path';

import { ARCHIVE_PATH } from '@src/config';
import { ISubtitle } from '@src/models';
import { pathToURL } from '@src/utils';

export async function findSubtitle(videoPath: string): Promise<ISubtitle[]> {
  const realVideoPath = join(ARCHIVE_PATH, videoPath);

  if (extname(videoPath) !== '.mp4') {
    throw new Error(`'${videoPath}' is not mp4`);
  }

  const dirPath = dirname(videoPath);
  const files = await fsPromises.readdir(dirname(realVideoPath));
  const subtitles: ISubtitle[] = [];

  for (const file of files) {
    const { name, ext } = parse(file);

    if (name === parse(videoPath).name && (ext === '.smi' || ext === '.srt')) {
      subtitles.push({
        language: 'ko',
        url: pathToURL(join(dirPath, `${name}.vtt`)),
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
          url: pathToURL(join(dirPath, `${name}.vtt`)),
        });
      }
    }
  }

  return subtitles;
}
