import * as Joi from '@hapi/joi';
import { basename, extname } from 'path';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';
import { ffprobeVideo } from '@src/rpc';
import { FFProbeVideo } from '@src/models';

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

  const ffprobe: FFProbeVideo = await ffprobeVideo(path);

  await Video.insert({
    path,
    duration: ffprobe.duration,
    width: ffprobe.width,
    height: ffprobe.height,
    bitrate: ffprobe.bitrate,
    size: ffprobe.size.toString(),
    title: basename(path, extname(path)),
    date: new Date(),
  });

  return [204, {}];
}
