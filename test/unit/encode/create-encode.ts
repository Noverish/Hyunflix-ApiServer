import * as sinon from 'sinon';
import { assert } from 'chai';
import 'mocha';

import createEncode from '@src/services/encode/create-encode';
import { Encode } from '@src/entity';
import { testStubArgs } from '@test/unit/utils';

const baseTest = {
  insertArgs: [],
  insertStub: () => (
    sinon.stub(Encode, 'insert').resolves({ identifiers: [{ id: 1 }] } as any)
  ),
};

const tests = [
  {
    ...baseTest,
    title: 'Success',
    input: { inpath: 'asdf', outpath: 'fdsa', options: 'aaaa' },
    insertArgs: [[{ inpath: 'asdf', outpath: 'fdsa', options: 'aaaa' }]],
    output: { id: 1 },
  },
];

describe('EncodeService.createEncode', () => {
  afterEach(() => {
    sinon.restore();
  });

  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      const insertStub: sinon.SinonStub = test.insertStub();

      const output = await createEncode(test.input);

      assert.deepEqual(test.output, output);
      testStubArgs(test.insertArgs, insertStub);
    });
  });
});
