import * as Joi from '@hapi/joi';

import { ServiceResult, YoutubeService } from '@src/services';

const schema = Joi.object({
  url: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
});

export default async function (body: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(body);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { url, tags } = value as any;

  YoutubeService.download(url, tags);

  return [204, {}];
}
