import * as Joi from '@hapi/joi';

import { Encode } from '@src/entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

const schema = Joi.object({
  inpath: Joi.string().required(),
  outpath: Joi.string().required(),
  options: Joi.string().required(),
});

export default async function (args: object) {
  const { value, error } = schema.validate(args);
  if (error) {
    throw new Error(`400 - ${error.message}`);
  }

  const partialEntity: QueryDeepPartialEntity<Encode> = value;

  const result = await Encode.insert(partialEntity);

  return { id: result.identifiers[0].id };
}
