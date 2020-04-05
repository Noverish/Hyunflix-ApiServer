import * as sinon from 'sinon';
import 'mocha';

import { init } from '@test/integration';
import getEncode from '@src/services/encode/get-encode';
import { Encode } from '@src/entity';

before(init);

describe('EncodeService.getEncode', () => {
  it('test', async () => {
    const findOneSpy = sinon.spy(Encode, 'findOne');

    const params = { encodeId: 1 };
    const result = await getEncode(params);
    console.log(findOneSpy.getCall(0).args);
    console.log(result);
  });
});
