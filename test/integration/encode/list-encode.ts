import * as sinon from 'sinon';
import 'mocha';

import { init } from '@test/integration';
import listEncode from '@src/services/encode/list-encode';
import { Encode } from '@src/entity';

before(init);

describe('EncodeService.listEncode', () => {
  it('test', async () => {
    const findspy = sinon.spy(Encode, 'find');

    const body = { q: 'asdf' };
    const result = await listEncode(body);
    console.log(findspy.getCall(0).args);
    console.log(JSON.stringify(result, null, 2));
  });
});
