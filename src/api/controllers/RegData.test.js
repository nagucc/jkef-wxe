/* eslint-env mocha */
import { expect } from 'chai';
import { createRequest, createResponse } from 'node-mocks-http';
import * as regRest from './RegistrationData';
import 'babel-polyfill';

describe('cee-result api check', () => {
  it('post information to mongodb from registration', async () => {
    const req = createRequest({
      body: {
        name: 'bai',
        id: '123456789',
        sex: '男',
        style: '理科',
        graduation: 'kyyz',
        grade: '555',
        university: 'ynu',
        major: 'eie',
        degree: 'graduate',
      },
    });
    const res = createResponse();
    await regRest.postAdd(req, res);
    let data = res._getData();
    if (data.ret === 1) {
      data = JSON.parse(data);
      expect(data.name).equal(req.body.name);
    } else if (data.ret === 0) {
      expect(data.info).to.equal('请勿重复提交');
    } else if (data.ret === -1) expect(data.info).to.equal('Error occurred:database error.');
  });
  it('get information from mongodb by id', async () => {
    const req = createRequest({
      params: {
        id: '123456789',
      },
    });
    const res = createResponse();
    await regRest.getDetail(req, res);
    let data = res._getData();
    if (data.ret === undefined) {
      data = JSON.parse(data);
      // console.log(data);
      expect(data).to.be.instanceof(Object);
    } else if (data.ret === 0) {
      expect(data.info).to.equal('给定的id不存在');
    } else expect(data.info).to.equal('Error occurred:database error.');
  });
});
