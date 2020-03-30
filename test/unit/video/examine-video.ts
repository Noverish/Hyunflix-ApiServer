import { assert } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

import examineVideo from '@src/services/video/examine-video';
import { Video } from '@src/entity';
import { Raw } from 'typeorm';

const baseTest = {
  input: { videoId: 1234, authority: 1 },
  output: [204, {}],

  findOneArgs: [
    [{ id: 1234, authority: Raw(`${1} & authority`) }],
  ],
  findOneReturns: (() => {
    const video = new Video();
    video.id = 1234;
    video.path = 'asdf/asdf';
    return video;
  })(),

  ffprobeVideoArgs: [
    ['asdf/asdf'],
  ],
  ffprobeVideoReturns: { width: 1920, height: 1080, size: '12341234', bitrate: 1234, duration: 1000 },

  updateArgs: [
    [1234, { width: 1920, height: 1080, size: '12341234', bitrate: 1234, duration: 1000 }],
  ],
};

const tests = [
  {
    title: 'Success',
    ...baseTest,
  },
  {
    title: 'Empty Input',
    ...baseTest,
    input: {},
    output: [400, { msg: '"videoId" is required' }],
    findOneArgs: [],
    ffprobeVideoArgs: [],
    updateArgs: [],
  },
  {
    title: 'No videoId in input',
    ...baseTest,
    input: { authority: 1 },
    output: [400, { msg: '"videoId" is required' }],
    findOneArgs: [],
    ffprobeVideoArgs: [],
    updateArgs: [],
  },
  {
    title: 'No authority in input',
    ...baseTest,
    input: { videoId: 1234 },
    output: [400, { msg: '"authority" is required' }],
    findOneArgs: [],
    ffprobeVideoArgs: [],
    updateArgs: [],
  },
  {
    title: 'Not exists video id',
    ...baseTest,
    output: [404, { msg: 'Not Found' }],
    findOneReturns: null,
    ffprobeVideoArgs: [],
    updateArgs: [],
  },
];

describe('VideoService.examineVideo', () => {
  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      const findOneStub: sinon.SinonStub = sinon.stub(Video, 'findOne').resolves(test.findOneReturns);
      const updateStub: sinon.SinonStub = sinon.stub(Video, 'update');
      const ffprobeVideoStub: sinon.SinonStub = sinon.stub().resolves(test.ffprobeVideoReturns);

      const output = await examineVideo(test.input, ffprobeVideoStub);

      assert.deepEqual<any>(test.output, output);

      assert.equal(test.findOneArgs.length, findOneStub.callCount);
      test.findOneArgs.forEach((args, i) => assert.deepEqual<any>(args, findOneStub.getCall(i).args));

      assert.equal(test.ffprobeVideoArgs.length, ffprobeVideoStub.callCount);
      test.ffprobeVideoArgs.forEach((args, i) => assert.deepEqual<any>(args, ffprobeVideoStub.getCall(i).args));

      assert.equal(test.updateArgs.length, updateStub.callCount);
      test.updateArgs.forEach((args, i) => assert.deepEqual<any>(args, updateStub.getCall(i).args));

      sinon.restore();
    });
  });
});
