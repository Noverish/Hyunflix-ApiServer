import * as Joi from '@hapi/joi';
import { getConnection, Raw } from 'typeorm';

import { ServiceResult } from '@src/services';
import { Video } from '@src/entity';

interface Schema {
  authority: number;
}

const schema = Joi.object({
  authority: Joi.number().required(),
});

export default async function (args: object): Promise<ServiceResult> {
  const { value, error } = schema.validate(args);
  if (error) {
    return [400, { msg: error.message }];
  }

  const { authority } = value as Schema;

  const rawTags: { tags: string }[] = (await getConnection()
    .getRepository(Video)
    .createQueryBuilder()
    .select('tags')
    .groupBy('tags')
    .where({ authority: Raw(`${authority} & authority`) })
    .getRawMany());

  const tagsSet = rawTags
    .map(v => v.tags.split(','))
    .reduce((acc, v) => new Set([...acc, ...v]), new Set<string>());

  return [200, Array.from(tagsSet)];
}
