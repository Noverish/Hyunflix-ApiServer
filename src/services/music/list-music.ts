import * as Joi from '@hapi/joi';
import * as Fuse from 'fuse.js';
import { Raw } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Music } from '@src/entity';
import { IMusic } from '@src/models';

interface Schema {
  q?: string;
  p: number;
  ps?: number;
  authority: number;
}

const schema = Joi.object({
  q: Joi.string().optional().empty(''),
  p: Joi.number().optional().default(1),
  ps: Joi.number().optional(),
  authority: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { q: query, p: page, ps: pageSize, authority } = value as Schema;

  const tmp: Music[] = await Music.find({
    order: { id: 'DESC' },
    where: { authority: Raw(`${authority} & authority`) },
  });

  const musics: IMusic[] = tmp.map(m => m.convert());

  const searched = (query)
    ? search(musics, query)
    : musics;

  const sliced = (pageSize)
    ? searched.slice((page - 1) * pageSize, page * pageSize)
    : searched;

  return [200, { total: searched.length, results: sliced }];
}

function search(musics: IMusic[], query: string): IMusic[] {
  return new Fuse(musics, {
    shouldSort: true,
    threshold: 0.1,
    maxPatternLength: 32,
    keys: ['tags', 'title'],
  }).search(query);
}
