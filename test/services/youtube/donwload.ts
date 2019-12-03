import { assert } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

import { YoutubeService } from '@src/services';
import { Music } from '@src/entity';
import { youtube1 } from '@test/examples';

describe('YoutubeService - download', () => {
  it(youtube1.title, async function () {
    const insertStub: sinon.SinonStub = sinon.stub(Music, 'insert');
    const tags = youtube1.tags.split(',');

    this.timeout(0);
    await YoutubeService.download(youtube1.url, tags);

    sinon.restore();
    const args = insertStub.getCall(0).args;
    assert.deepInclude<any>(youtube1, args[0]);
  });
});
