import * as Joi from '@hapi/joi';

import { Encode } from '@src/entity';

const schema = Joi.number().positive().integer().label('encodeId');

export default async function (encodeIdParam: any) {
  const { value, error } = schema.validate(encodeIdParam);
  if (error) {
    throw new Error(`400 - ${error.message}`);
  }
  const encodeId: number = value;

  const encode: Encode | undefined = await Encode.findOne({
    where: { id: encodeId },
    relations: ['before', 'after'],
  });

  if (encode) {
    return encode.convert();
  }
  throw new Error('404 - Not Found');
}
