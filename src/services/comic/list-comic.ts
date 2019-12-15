import * as Joi from '@hapi/joi';

import { ServiceResult } from '@src/services';
import { Comic } from '@src/entity';

interface Schema {

}

const schema = Joi.object({

});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const list: Comic[] = await Comic.find();

  return [200, { total: list.length, results: list.map(v => v.convert()) }];
}
