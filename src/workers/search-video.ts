import * as Fuse from 'fuse.js';

import { IVideo } from '@src/models';

export default function (videos: IVideo[], query: string): IVideo[] {
  const options = {
    shouldSort: true,
    threshold: 0.5,
    maxPatternLength: 32,
    keys: ['tags', 'title'],
  };
  const fuse = new Fuse(videos, options);
  const result = fuse.search(query);
  return result;
}
