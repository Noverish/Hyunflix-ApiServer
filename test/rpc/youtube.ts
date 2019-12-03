import { assert } from 'chai';
import 'mocha';

import { downloadYoutube } from '@src/rpc';
import { YoutubeStatus } from '@src/models';
import { youtube1 } from '@test/examples';

const STATUS_MOCK: YoutubeStatus = { progress: 0, total: 0, speed: 0, eta: 0 };

describe('RPC - downloadYoutube', () => {
  it(youtube1.title, async function () {
    this.timeout(0);

    const path = await downloadYoutube(youtube1.url, (status: YoutubeStatus) => {
      assert.hasAllKeys(status, STATUS_MOCK);
    });
    assert(path, `/Musics/download/${youtube1.title}.webm`);
  });
});
