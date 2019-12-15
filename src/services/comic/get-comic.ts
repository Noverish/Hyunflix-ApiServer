import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { Comic } from '@src/entity';

interface Schema {
  comicId: number;
}

const schema = Joi.object({
  comicId: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { comicId } = value as Schema;

  const comic: Comic | undefined = await Comic.findOne(comicId);

  if (!comic) {
    return [404, { msg: 'Not Found' }];
  }

  return [200, comic.convert()];
}
