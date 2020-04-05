import * as sinon from 'sinon';
import { assert } from 'chai';
import 'mocha';

import listEncode from '@src/services/encode/list-encode';
import { Encode, EncodeResult } from '@src/entity';
import { testStubArgs } from '@test/unit/utils';

const encode = new Encode();
encode.id = 1;
encode.inpath = 'a';
encode.outpath = 'b';
encode.options = 'c';
encode.progress = 10;
encode.date = new Date('2020-01-01T00:00:00');
const encodeResult = new EncodeResult();
encodeResult.id = 1;
encodeResult.bitrate = 2;
encodeResult.duration = 3;
encodeResult.width = 4;
encodeResult.height = 5;
encodeResult.size = '6';
encodeResult.date = new Date('2020-01-02T00:00:00');
encode.before = encodeResult;

const baseTest = {
  findArgs: [],
  findStub: () => (
    sinon.stub(Encode, 'find').resolves([encode])
  ),
};

const tests = [
  {
    ...baseTest,
    title: 'Success',
    input: {},
    findArgs: [[{ order: { id: 'DESC' }, relations: ['before', 'after'] }]],
    output: {
      total: 1,
      results: [{
        after: null,
        before: {
          bitrate: 2,
          date: '2020-01-02T00:00:00.000Z',
          duration: 3,
          height: 5,
          id: 1,
          size: 6,
          width: 4,
        },
        date: '2020-01-01T00:00:00.000Z',
        id: 1,
        inpath: 'a',
        options: 'c',
        outpath: 'b',
        progress: 10,
      }],
    },
  },
];

describe('EncodeService.listEncode', () => {
  afterEach(() => {
    sinon.restore();
  });

  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      const findStub: sinon.SinonStub = test.findStub();

      const output = await listEncode(test.input);

      assert.deepEqual(test.output, output);
      testStubArgs(test.findArgs, findStub);
    });
  });
});
