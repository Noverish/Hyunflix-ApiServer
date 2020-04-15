import * as Joi from '@hapi/joi';
import * as Fuse from 'fuse.js';
import { Raw, Like, FindConditions } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';
import { IVideo } from '@src/models';

interface Schema {
  q?: string;
  p: number;
  ps?: number;
  tag?: string;
  authority: number;
}

const schema = Joi.object({
  q: Joi.string().optional().empty(''),
  p: Joi.number().optional().default(1),
  ps: Joi.number().optional(),
  tag: Joi.string().optional().empty(''),
  authority: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { q: query, p: page, ps: pageSize, tag, authority } = value as Schema;

  const where: FindConditions<Video> = {
    authority: Raw(`${authority} & authority`),
  };

  if (tag) {
    where.tags = Like(`%${tag}%`);
  }

  const tmp: Video[] = await Video.find({
    where,
    order: { id: 'DESC' },
  });

  const videos: IVideo[] = tmp.map(m => m.convert());

  const searched = (query)
    ? search(videos, query)
    : videos;

  const sliced = (pageSize)
    ? searched.slice((page - 1) * pageSize, page * pageSize)
    : searched;

  return [200, { total: searched.length, results: sliced }];
}

function search(videos: IVideo[], query: string): IVideo[] {
  return new Fuse(videos, {
    shouldSort: true,
    threshold: 0.1,
    maxPatternLength: 32,
    keys: ['tags', 'title'],
  }).search(query);
}
