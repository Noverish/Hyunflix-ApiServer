import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { MusicPlaylist } from '@src/entity';

interface Schema {
  title: string;
  userId: number;
}

const schema = Joi.object({
  title: Joi.string().required(),
  userId: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { title, userId } = value as Schema;

  await MusicPlaylist.insert({ title, userId });

  return [204, {}];
}
