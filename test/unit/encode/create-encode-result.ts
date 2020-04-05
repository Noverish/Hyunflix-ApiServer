import * as sinon from 'sinon';
import { assert } from 'chai';
import 'mocha';

import createEncodeResult from '@src/services/encode/create-encode-result';
import { EncodeResult } from '@src/entity';
import { testStubArgs } from '@test/unit/utils';

const baseTest = {
  insertArgs: [],
  insertStub: () => (
    sinon.stub(EncodeResult, 'insert').resolves({ identifiers: [{ id: 1 }] } as any)
  ),
};

const tests = [
  {
    ...baseTest,
    title: 'Success',
    input: { duration: 1, bitrate: 2, width: 3, height: 4, size: 5 },
    insertArgs: [[{ duration: 1, bitrate: 2, width: 3, height: 4, size: '5' }]],
    output: { id: 1 },
  },
  {
    ...baseTest,
    title: 'Success with date',
    input: { duration: 1, bitrate: 2, width: 3, height: 4, size: 5, date: '2020-01-01T00:00:00' },
    insertArgs: [[{ duration: 1, bitrate: 2, width: 3, height: 4, size: '5', date: new Date('2020-01-01T00:00:00') }]],
    output: { id: 1 },
  },
];

describe('EncodeService.createEncodeResult', () => {
  afterEach(() => {
    sinon.restore();
  });

  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      const insertStub: sinon.SinonStub = test.insertStub();

      const output = await createEncodeResult(test.input);

      assert.deepEqual(test.output, output);
      testStubArgs(test.insertArgs, insertStub);
    });
  });
});
