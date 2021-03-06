import * as Joi from '@hapi/joi';
import { Raw } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Comic } from '@src/entity';

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

  return (comic)
    ? [200, comic.convert()]
    : [404, { msg: 'Not Found' }];
}
