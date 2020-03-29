import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface Params {
  videoId: number;
}

const schema = Joi.object({
  videoId: Joi.number().required(),
});

export default async function (params: object, body: QueryDeepPartialEntity<Video>): Promise<ServiceResult> {
  const { value, error } = schema.validate(params);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { videoId } = value as Params;

  const video: Video | undefined = await Video.findOne({ id: videoId });
  if (!video) {
    return [404, { msg: 'Not Found' }];
  }

  await Video.update(videoId, body);

  return [204, {}];
}
