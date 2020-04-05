import * as sinon from 'sinon';
import { assert } from 'chai';
import 'mocha';

import updateEncode from '@src/services/encode/update-encode';
import { Encode, EncodeResult } from '@src/entity';
import { testStubArgs } from '@test/unit/utils';

const encode = new Encode();
const encodeResult1 = new EncodeResult();
const encodeResult2 = new EncodeResult();

const baseTest = {
  encodeFindOneArgs: [],
  encodeFindOneStub: () => (
    sinon.stub(Encode, 'findOneOrFail').resolves(encode)
  ),

  encodeResultFindOneArgs: [],
  encodeResultFindOneStub: () => (
    sinon.stub(EncodeResult, 'findOneOrFail')
      .onFirstCall()
      .returns(Promise.resolve(encodeResult1))
      .onSecondCall()
      .returns(Promise.resolve(encodeResult2))
  ),

  updateArgs: [],
};

const tests = [
  {
    ...baseTest,
    title: 'encodeId is not number',
    input: { encodeId: 'asdf', body: {} },
    output: '400 - "encodeId" must be a number',
  },
  {
    ...baseTest,
    title: 'empty body',
    input: { encodeId: '1', body: {} },
    output: '400 - "body" must have at least 1 key',
  },
  {
    ...baseTest,
    title: 'Success with progress',
    input: { encodeId: '1', body: { progress: 1 } },
    encodeFindOneArgs: [[1]],
    updateArgs: [[1, { progress: 1 }]],
    output: {},
  },
  {
    ...baseTest,
    title: 'Success with beforeId',
    input: { encodeId: '1', body: { beforeId: 1 } },
    encodeFindOneArgs: [[1]],
    encodeResultFindOneArgs: [[1]],
    updateArgs: [[1, { before: encodeResult1 }]],
    output: {},
  },
  {
    ...baseTest,
    title: 'Success with beforeId is null',
    input: { encodeId: '1', body: { beforeId: null } },
    encodeFindOneArgs: [[1]],
    updateArgs: [[1, { before: null }]],
    output: {},
  },
  {
    ...baseTest,
    title: 'Success with beforeId, afterId',
    input: { encodeId: '1', body: { beforeId: 1, afterId: 2 } },
    encodeFindOneArgs: [[1]],
    encodeResultFindOneArgs: [[1], [2]],
    updateArgs: [[1, { before: encodeResult1, after: encodeResult2 }]],
    output: {},
  },
  {
    ...baseTest,
    title: 'Success with beforeId is null, afterId is null',
    input: { encodeId: '1', body: { beforeId: null, afterId: null } },
    encodeFindOneArgs: [[1]],
    updateArgs: [[1, { before: null, after: null }]],
    output: {},
  },
];

describe('EncodeService.updateEncode', () => {
  afterEach(() => {
    sinon.restore();
  });

  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      const encodeFindOneStub: sinon.SinonStub = test.encodeFindOneStub();
      const encodeResultFindOneStub: sinon.SinonStub = test.encodeResultFindOneStub();
      const updateStub: sinon.SinonStub = sinon.stub(Encode, 'update');

      try {
        const output = await updateEncode(test.input.encodeId, test.input.body);
        assert.deepEqual(test.output, output);
      } catch (err) {
        assert.deepEqual(test.output, err.message);
      }

      testStubArgs(test.encodeFindOneArgs, encodeFindOneStub);
      testStubArgs(test.encodeResultFindOneArgs, encodeResultFindOneStub);
      testStubArgs(test.updateArgs, updateStub);
    });
  });
});
