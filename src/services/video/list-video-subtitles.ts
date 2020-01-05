import * as Joi from '@hapi/joi';
import { Raw } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';
import { RawSubtitle, ISubtitle } from '@src/models';
import { subtitle } from '@src/rpc';
import { pathToURL } from '@src/utils';

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

  if (!video) {
    return [404, { msg: 'Not Found' }];
  }

  const rawSubtitles: RawSubtitle[] = await subtitle(video.path);

  const subtitles: ISubtitle[] = rawSubtitles.map(s => ({
    language: s.language,
    url: pathToURL(s.path),
  }));

  return [200, subtitles];
}
