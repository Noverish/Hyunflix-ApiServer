import * as Joi from '@hapi/joi';
import { Raw } from 'typeorm';
import { join } from 'path';

import { ServiceResult } from '@src/services';
import { Comic } from '@src/entity';
import { pathToURL } from '@src/utils';
import { readdir } from '@src/rpc';

interface Schema {
  comicId: number;
  authority: number;
}

const schema = Joi.object({
  comicId: Joi.number().required(),
  authority: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { comicId, authority } = value as Schema;

  const comic: Comic | undefined = await Comic.findOne({
    id: comicId,
    authority: Raw(`${authority} & authority`),
  });

  if (!comic) {
    return [404, { msg: 'Not Found' }];
  }

  const urls = (await readdir(comic.path))
    .map(v => join(comic.path, v))
    .map(pathToURL);

  return [200, urls];
}
