import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { MusicPlaylist } from '@src/entity';

interface Schema {
  userId: number;
  playlistId: number;
}

const schema = Joi.object({
  userId: Joi.number().required(),
  playlistId: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { userId, playlistId } = value as Schema;

  const playlist: MusicPlaylist | undefined = await MusicPlaylist.findOne({
    where: { userId, id: playlistId },
    relations: ['musics'],
  });

  return (playlist)
    ? [200, playlist.convert()]
    : [404, { msg: 'Not Found' }];
}
