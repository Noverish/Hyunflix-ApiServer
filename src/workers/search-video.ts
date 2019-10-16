import * as Fuse from 'fuse.js';

import { IVideoArticle } from '@src/models';

export default function (articles: IVideoArticle[], query: string): IVideoArticle[] {
  const options = {
    shouldSort: true,
    threshold: 0.5,
    maxPatternLength: 32,
    keys: ['tags', 'title'],
  };
  const fuse = new Fuse(articles, options);
  const result = fuse.search(query);
  return result;
}
