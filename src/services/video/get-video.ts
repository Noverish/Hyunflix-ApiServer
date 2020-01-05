import * as Joi from '@hapi/joi';
import { Raw } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';

interface Schema {
  videoId: number;
  authority: number;
}

const schema = Joi.object({
  videoId: Joi.number().required(),
  authority: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { videoId, authority } = value as Schema;

  const video: Video | undefined = await Video.findOne({
    id: videoId,
    authority: Raw(`${authority} & authority`),
  });

  return (video)
    ? [200, video.convert()]
    : [404, { msg: 'Not Found' }];
}
