import { assert } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

import { init } from '@test/integration';
import listVideo from '@src/services/video/list-video';
import { IVideo } from '@src/models';

before(init);

const tests = [
  {
    title: 'default',
    input: { ps: 100, authority: 1 },
  },
  {
    title: 'tag:영화',
    input: { ps: 100, authority: 1, tag: '영화' },
  },
];

describe('EncodeService.listEncode', async () => {
  tests.forEach((test) => {
    it(test.title, async () => {
      const { input } = test;

      const result = (await listVideo(input))[1];
      const results = (result as any).results as IVideo[];

      assert.equal(results.length, input.ps);

      if (input.tag) {
        results.forEach((v) => {
          assert.include(v.tags, input.tag);
        });
      }
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
