/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-polyfill';
import { expect } from 'chai';
import { createRequest, createResponse } from 'node-mocks-http';
import { ensureAcceptorCanBeAdded } from './middlewares';

describe('Express Middlewares', () => {

  it('姓名、证件信息为任一为空时返回错误信息', async () => {
    const req = createRequest({
      user: {
        errcode: 0,
      },
      body: {
        name: 'tet',
      },
    });
    const res = createResponse();
    await ensureAcceptorCanBeAdded(req, res);
    const data = res._getData();
    expect(data.ret).eql(-1);
  });

  it('用户使用微信登录，且姓名、证件信息均不为空时才能正常下一步',
    async () => {
      const req = createRequest({
        user: {
          errcode: 0,
        },
        body: {
          idCard: {
            type: 'test',
            number: 1,
          },
          name: 'test',
        },
      });
      const res = createResponse();
      await ensureAcceptorCanBeAdded(req, res, () => {
        res.send({ ret: 0 });
      });
      const data = res._getData();
      expect(data.ret).eql(0);
    });

});
