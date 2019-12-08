import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { MusicPlaylist, Music } from '@src/entity';

interface Schema {
  playlistId: number;
  userId: number;
  title?: string;
  musicIds?: number[];
}

const schema = Joi.object({
  playlistId: Joi.number().required(),
  userId: Joi.number().required(),
  title: Joi.string(),
  musicIds: Joi.array().items(Joi.number()),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { playlistId, title, userId, musicIds } = value as Schema;

  const playlist: MusicPlaylist | undefined = await MusicPlaylist.findOne({ userId, id: playlistId });
  if (!playlist) {
    return [404, { msg: 'Not Found' }];
  }

  title && (playlist.title = title);
  musicIds && (playlist.musics = await Music.findByIds(musicIds));
  playlist.save();

  return [204, {}];
}
