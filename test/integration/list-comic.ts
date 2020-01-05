import { assert } from 'chai';
import 'mocha';

import { init, end } from '.';
import { ComicService } from '@src/services';

before(init);

describe('test1', () => {
  it('test2', async () => {
    const authority = [];

    const result = await ComicService.listComic({ authority });

    console.log('result', result);

    assert.equal(result.length, 2);
  });
});

after(end);
