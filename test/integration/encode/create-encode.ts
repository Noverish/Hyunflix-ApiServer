import * as sinon from 'sinon';
import 'mocha';

import { init } from '@test/integration';
import createEncode from '@src/services/encode/create-encode';
import { Encode } from '@src/entity';

before(init);

describe('EncodeService.createEncode', () => {
  it('test', async () => {
    const insertSpy = sinon.spy(Encode, 'insert');

    const body = { inpath: '/a/b', outpath: '/c/d', options: '-a 1 -b c' };
    const result = await createEncode(body);
    console.log(insertSpy.getCall(0).args);
    console.log(result);
  });
});
