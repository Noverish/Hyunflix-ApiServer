import { assert } from 'chai';

export function testStubArgs(argsList: any[][], stub: sinon.SinonStub) {
  assert.equal(argsList.length, stub.callCount);
  argsList.forEach((args, i) => assert.deepEqual<any[]>(args, stub.getCall(i).args));
}
