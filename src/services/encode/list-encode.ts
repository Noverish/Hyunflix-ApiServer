import * as Joi from '@hapi/joi';

import { Encode } from '@src/entity';
import { EncodeDTO } from '@src/models';
import { FindManyOptions, IsNull, Not } from 'typeorm';

interface Schema {
  q?: string;
  p: number;
  ps?: number;
  status?: 'queued' | 'processing' | 'done';
  order: 'DESC' | 'ASC';
}

const schema = Joi.object({
  q: Joi.string().optional().empty(''),
  p: Joi.number().optional().default(1),
  ps: Joi.number().optional(),
  status: Joi.string().optional().allow('queued', 'processing', 'done'),
  order: Joi.string().optional().allow('DESC', 'ASC').default('DESC'),
});

export default async function (args: object) {
  const { value, error } = schema.validate(args);
  if (error) {
    throw new Error(`400 - ${error.message}`);
  }

  const { q: query, p: page, ps: pageSize, status, order } = value as Schema;

  const options: FindManyOptions<Encode> = {
    order: { id: order },
    relations: ['before', 'after'],
  };

  if (status) {
    if (status === 'queued') {
      options.where = { before: IsNull(), after: IsNull() };
    } else if (status === 'processing') {
      options.where = { before: Not(IsNull()), after: IsNull() };
    } else if (status === 'done') {
      options.where = { before: Not(IsNull()), after: Not(IsNull()) };
    }
  }

  const found: Encode[] = await Encode.find(options);

  const searched: Encode[] = (query)
    ? found.filter(v => v.inpath.includes(query) || v.outpath.includes(query) || v.options.includes(query))
    : found;

  const sliced: Encode[] = (pageSize)
    ? searched.slice((page - 1) * pageSize, page * pageSize)
    : searched;

  const results: EncodeDTO[] = sliced.map(v => v.convert());

  return { results, total: searched.length };
}
