import * as Joi from '@hapi/joi';

import { Encode } from '@src/entity';
import { EncodeDTO } from '@src/models';

interface Schema {
  q?: string;
  p: number;
  ps?: number;
}

const schema = Joi.object({
  q: Joi.string().optional().empty(''),
  p: Joi.number().optional().default(1),
  ps: Joi.number().optional(),
});

export default async function (args: object) {
  const { value, error } = schema.validate(args);
  if (error) {
    throw new Error(`400 - ${error.message}`);
  }

  const { q: query, p: page, ps: pageSize } = value as Schema;

  const found: Encode[] = await Encode.find({
    order: { id: 'DESC' },
    relations: ['before', 'after'],
  });

  const searched: Encode[] = (query)
    ? found.filter(v => v.inpath.includes(query) || v.outpath.includes(query) || v.options.includes(query))
    : found;

  const sliced: Encode[] = (pageSize)
    ? searched.slice((page - 1) * pageSize, page * pageSize)
    : searched;

  const results: EncodeDTO[] = sliced.map(v => v.convert());

  return { results, total: searched.length };
}
