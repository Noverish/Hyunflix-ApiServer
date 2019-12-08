import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { MusicPlaylist } from '@src/entity';

interface Schema {
  userId: number;
}

const schema = Joi.object({
  userId: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { userId } = value as Schema;

  const list: MusicPlaylist[] = await MusicPlaylist.find({
    where: { userId },
    relations: ['musics'],
  });

  return [200, list.map(v => v.convert())];
}
