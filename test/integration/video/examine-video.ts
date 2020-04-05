import * as sinon from 'sinon';
import 'mocha';

import { init } from '@test/integration';
import examineVideo from '@src/services/video/examine-video';
import { Video } from '@src/entity';
import { ffprobeVideo } from '@src/rpc';

before(init);

describe('VideoService.examineVideo', () => {
  it('test', async () => {
    const updateSpy = sinon.spy(Video, 'update');
    const findOneSpy = sinon.spy(Video, 'findOne');

    const result = await examineVideo({ authority: 1, videoId: 934 }, ffprobeVideo);
    console.log(findOneSpy.returnValues);
    console.log(updateSpy.getCall(0).args);
    console.log(result);
  });
});
