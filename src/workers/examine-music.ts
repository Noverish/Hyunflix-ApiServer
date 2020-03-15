import { extname, basename } from 'path';

import { Music } from '@src/entity';
import { walk, ffprobeMusic } from '@src/rpc';
import { MUSIC_FOLDER_PATH } from '@src/config';
import { FFProbeMusic } from '@src/models';

type Callback = (msg: string) => void;

export default function () {
  const callback: Callback = (msg: string) => {

  };

  (async () => {
    const allFilePaths: string[] = await walk(MUSIC_FOLDER_PATH);
    const musicPaths: string[] = allFilePaths.filter(f => extname(f) === '.mp3');

    await examineInsert(musicPaths, callback);
    await examineDelete(musicPaths, callback);

    callback('Done!');
  })().catch(err => callback(err.stack));
}

async function examineInsert(paths: string[], callback: Callback) {
  for (const path of paths) {
    const music: Music | null = await Music.findOne({ path });

    if (!music) {
      const ffprobe: FFProbeMusic = await ffprobeMusic(path);

      await Music.insert({
        path,
        title: basename(path, extname(path)),
        duration: ffprobe.duration,
        tags: '',
        youtube: null,
      });

      callback(`[Inserted] ${path}`);
    }
  }
}

async function examineDelete(paths: string[], callback: Callback) {
  const musics: Music[] = await Music.find();

  for (const music of musics) {
    const { path } = music;

    if (!paths.includes(path)) {
      const music2 = await Music.findOne({ path });
      await music2.remove();
      callback(`[Deleted] ${path}`);
    }
  }
}
