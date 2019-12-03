import { assert } from 'chai';
import 'mocha';

import { ffmpeg } from '@src/rpc';
import { FFMpegStatus } from '@src/models';

const STATUS_MOCK: FFMpegStatus = { frame: 0, fps: 0, q: 0, size: 0, time: 0, bitrate: 0, speed: 0, progress: 0, eta: 0 };

describe('RPC - ffmpeg', () => {
  it('test1.mkv', async function () {
    this.timeout(0);
    const inpath = '/Movies/test/test1.mkv';
    const outpath = '/Movies/test/test_output.mp4';
    const args = '-vcodec libx264 -acodec aac -ac 2 -t 1 -y'.split(' ');

    await ffmpeg(inpath, outpath, args, (status: FFMpegStatus) => {
      assert.hasAllKeys(status, STATUS_MOCK);
    });
  });

  it('error1.avi', async function () {
    this.timeout(0);
    const inpath = '/Movies/test/error1.avi';
    const outpath = '/Movies/test/test_output.mp4';
    const args = '-vcodec libx264 -acodec aac -ac 2 -t 1 -y'.split(' ');

    await ffmpeg(inpath, outpath, args, (status: FFMpegStatus) => {
      assert.hasAllKeys(status, STATUS_MOCK);
    });
  });
});
