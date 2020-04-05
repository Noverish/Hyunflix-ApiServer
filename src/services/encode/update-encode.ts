import * as Joi from '@hapi/joi';

import { Encode, EncodeResult } from '@src/entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface Schema {
  inpath?: string;
  outpath?: string;
  options?: string;
  progress?: number;
  beforeId?: number;
  afterId?: number;
  date?: Date;
}

const encodeIdSchema = Joi.number().positive().integer().label('encodeId');

const bodySchema = Joi.object({
  inpath: Joi.string().optional(),
  outpath: Joi.string().optional(),
  options: Joi.string().optional(),
  progress: Joi.number().min(0).max(100).optional(),
  beforeId: Joi.number().positive().integer().optional()
    .allow(null),
  afterId: Joi.number().positive().integer().optional()
    .allow(null),
  date: Joi.date().iso().optional(),
}).min(1).label('body');

export default async function (encodeIdParam: any, args: object) {
  const { value: value1, error: error1 } = encodeIdSchema.validate(encodeIdParam);
  if (error1) {
    throw new Error(`400 - ${error1.message}`);
  }
  const encodeId = value1 as string;

  const { value: value2, error: error2 } = bodySchema.validate(args);
  if (error2) {
    throw new Error(`400 - ${error2.message}`);
  }
  const { beforeId, afterId, ...body } = value2 as Schema;

  try {
    await Encode.findOneOrFail(encodeId);
  } catch (err) {
    throw new Error('404 - Not Found');
  }

  const partialEntity: QueryDeepPartialEntity<Encode> = body;

  if (beforeId !== undefined) {
    partialEntity.before = (beforeId !== null)
      ? await EncodeResult.findOneOrFail(beforeId)
      : null;
  }

  if (afterId !== undefined) {
    partialEntity.after = (afterId !== null)
      ? await EncodeResult.findOneOrFail(afterId)
      : null;
  }

  await Encode.update(encodeId, partialEntity);

  return {};
}
