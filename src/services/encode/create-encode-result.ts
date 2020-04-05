import * as Joi from '@hapi/joi';

import { EncodeResult } from '@src/entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

const schema = Joi.object({
  duration: Joi.number().positive(),
  width: Joi.number().positive(),
  height: Joi.number().positive(),
  bitrate: Joi.number().positive(),
  size: Joi.number().positive(),
  date: Joi.date().iso().optional(),
});

export default async function (args: object) {
  const { value, error } = schema.validate(args);
  if (error) {
    throw new Error(`400 - ${error.message}`);
  }

  const partialEntity: QueryDeepPartialEntity<EncodeResult> = {
    ...value,
    size: value.size.toString(),
  };

  const result = await EncodeResult.insert(partialEntity);

  return { id: result.identifiers[0].id };
}
