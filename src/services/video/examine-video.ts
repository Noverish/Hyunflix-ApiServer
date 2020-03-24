import * as Joi from '@hapi/joi';
import { Raw } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';
import { ffprobeVideo } from '@src/rpc';
import { FFProbeVideo } from '@src/models';

interface Schema {
  videoId: number;
  authority: number;
}

const schema = Joi.object({
  videoId: Joi.number().required(),
  authority: Joi.number().required(),
});

export default async function (args: object, ffprobeVideoFunc: typeof ffprobeVideo): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { videoId, authority } = value as Schema;

  const video: Video | undefined = await Video.findOne({
    id: videoId,
    authority: Raw(`${authority} & authority`),
  });

  if (!video) {
    return [404, { msg: 'Not Found' }];
  }

  const probed: FFProbeVideo = await ffprobeVideoFunc(video.path);

  await Video.update(video.id, {
    bitrate: probed.bitrate,
    size: probed.size.toString(),
    width: probed.width,
    height: probed.height,
    duration: probed.duration,
  });

  return [204, {}];
}
