import * as Fuse from 'fuse.js';

import { IMusic } from '@src/models';

export default function (musics: IMusic[], query: string): IMusic[] {
  const options = {
    shouldSort: true,
    threshold: 0.1,
    maxPatternLength: 32,
    keys: ['tags', 'title'],
  };
  const fuse = new Fuse(musics, options);
  const result = fuse.search(query);
  return result;
}
