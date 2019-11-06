import { extname, basename } from 'path';

import { Music } from '@src/entity';
import { walk, ffprobeMusic } from '@src/rpc';
import { MUSIC_FOLDER_PATH, MUSIC_EXAMINE_SOCKET_PATH } from '@src/config';
import { FFProbeMusic, Stat } from '@src/models';
import { send } from '@src/sockets';

type Callback = (msg: string) => void;

export default function () {
  const callback: Callback = (msg: string) => {
    send(MUSIC_EXAMINE_SOCKET_PATH, msg);
  };

  (async function () {
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
        authority: '',
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
      const music = await Music.findOne({ path });
      await music.remove();
      callback(`[Deleted] ${path}`);
    }
  }
}
