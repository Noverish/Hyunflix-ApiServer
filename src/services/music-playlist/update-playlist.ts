import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { MusicPlaylist } from '@src/entity';

interface Schema {
  playlistId: number;
  title: string;
  userId: number;
}

const schema = Joi.object({
  playlistId: Joi.number().required(),
  title: Joi.string().required(),
  userId: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { playlistId, title, userId } = value as Schema;

  await MusicPlaylist.update({ userId, id: playlistId }, { title });

  return [204, {}];
}
