import * as sinon from 'sinon';
import 'mocha';

import { init } from '@test/integration';
import createEncodeResult from '@src/services/encode/create-encode-result';
import { EncodeResult } from '@src/entity';

before(init);

describe('EncodeService.createEncodeResult', () => {
  it('test', async () => {
    const insertSpy = sinon.spy(EncodeResult, 'insert');

    const body = { bitrate: 500, size: 1500, width: 1280, height: 720, duration: 10, date: '2020-04-04 18:00:00' };
    const result = await createEncodeResult(body);
    console.log(insertSpy.getCall(0).args);
    console.log(result);
  });
});
