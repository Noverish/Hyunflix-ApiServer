import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { MusicPlaylist } from '@src/entity';

interface Schema {
  playlistId: number;
  userId: number;
}

const schema = Joi.object({
  playlistId: Joi.number().required(),
  userId: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { playlistId, userId } = value as Schema;

  await MusicPlaylist.delete({ userId, id: playlistId });

  return [204, {}];
}
