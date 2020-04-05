import { assert } from 'chai';
import 'mocha';

import { init } from '@test/integration';
import updateEncode from '@src/services/encode/update-encode';
import getEncode from '@src/services/encode/get-encode';

const progress = Math.floor(Math.random() * 100);

const tests = [
  {
    title: 'Success with progress',
    input: { encodeId: '1', body: { progress } },
    assert: (result: any) => {
      assert.deepEqual(result.progress, progress);
    },
  },
  {
    title: 'Success with beforeId',
    input: { encodeId: '1', body: { beforeId: 2 } },
    assert: (result: any) => {
      assert.deepEqual(result.before.id, 2);
    },
  },
  {
    title: 'Success with beforeId is null',
    input: { encodeId: '1', body: { beforeId: null } },
    assert: (result: any) => {
      assert.deepEqual(result.before, null);
    },
  },
  {
    title: 'Success with beforeId, afterId',
    input: { encodeId: '1', body: { beforeId: 2, afterId: 1 } },
    assert: (result: any) => {
      assert.deepEqual(result.before.id, 2);
      assert.deepEqual(result.after.id, 1);
    },
  },
  {
    title: 'Success with beforeId is null, afterId is null',
    input: { encodeId: '1', body: { beforeId: null, afterId: null } },
    assert: (result: any) => {
      assert.deepEqual(result.before, null);
      assert.deepEqual(result.after, null);
    },
  },
];

before(init);

describe('EncodeService.updateEncode', () => {
  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      await updateEncode(test.input.encodeId, test.input.body);
      const result = await getEncode({ encodeId: test.input.encodeId });
      test.assert(result);
    });
  });
});
