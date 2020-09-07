import * as Joi from '@hapi/joi';
import { basename, extname } from 'path';

import { ServiceResult } from '@src/services';
import { Music } from '@src/entity';
import { ffprobeMusic } from '@src/rpc';
import { FFProbeMusic } from '@src/models';

interface Schema {
  path: string;
}

const schema = Joi.object({
  path: Joi.string().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { path } = value as Schema;

  const ffprobe: FFProbeMusic = await ffprobeMusic(path);

  await Music.insert({
    path,
    title: basename(path, extname(path)),
    duration: ffprobe.duration,
    date: new Date(),
  });

  return [204, {}];
}
