import { assert } from 'chai';
import 'mocha';

import { verifyToken } from '@src/services/token/index';

const tests = [
  {
    title: 'Success',
    input: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImF1dGhvcml0eSI6MjU1LCJhbGxvd2VkUGF0aHMiOlsiLyJdLCJpYXQiOjE1ODYwNjQwMjUsImV4cCI6MTkwMTY0MDAyNX0.EUKLKLLp34RnmvNDDhrYr5DSNm7JzPu7cQDN5NuKV13ft1sERo4vyc8P0xhGCtP_YGZwdcHg8HPsdto_wxvFFMP2tpCJcXCPlpE-xlMfGQiVPlxznYUF37NCknwmVwqBrXzRnHH4bsDDE_pM4LPDqF5Ue9afjy2NlmCikHxGdX4',
    output: { userId: 1, authority: 255, allowedPaths: ['/'], exp: 1901640025, iat: 1586064025 },
  },
];

describe('TokenService.verifyToken', () => {
  tests.forEach((test) => {
    const { title } = test;

    it(title, async () => {
      const output = await verifyToken(test.input);
      assert.deepEqual(test.output, output);
    });
  });
});
