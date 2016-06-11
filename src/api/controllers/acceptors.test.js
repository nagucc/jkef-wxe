/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-polyfill';
import { expect } from 'chai';
import { createRequest, createResponse } from 'node-mocks-http';
import { manageDpt, supervisorDpt } from '../../config';
import * as acceptors from './acceptors';
// import { findAcceptors, addAcceptor,
//   findAcceptorByIdCardNumber, findById, remove } from '../models/data-access';
//
// const dataGenerator = function* () {
//   // const id = await addAcceptor({
//   //   name: 'test',
//   //   idCard: {
//   //     type: 'test',
//   //     number: Math.random(),
//   //   },
//   //   isMale: false,
//   //   userid: 'test',
//   //   phone: '666',
//   // });
//   // const doc = await findById(id);
//   // yield doc;
//   // await remove(id);
// };
const myUserid = 88;
const otherUserid = 89;
const supervisorUserid = 90;
let doc;
describe('Acceptors Middlewares', () => {
  it('add 非管理员添加数据时将userid修改为自己', async () => {
    const req = createRequest({
      user: {
        department: [manageDpt + 99999],
        userid: myUserid,
      },
      body: {
        userid: myUserid + 11,
        name: 'test',
        idCard: { type: 'test', number: Math.random() },
      },
    });
    const res = createResponse();
    await acceptors.add(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
    doc = data.data;
    expect(doc.userid).eql(myUserid);
  });

  it('postUpdate 用户能更新自己的信息', async () => {
    const req = createRequest({
      user: {
        department: [manageDpt + 99999],
        userid: myUserid,
      },
      body: { ...doc, name: 'updated' },
      params: { id: doc._id },
    });
    const res = createResponse();
    await acceptors.postUpdate(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
    expect(data.data._id).eql(doc._id);
  });

  it('postUpdate 非管理员不能修改别人的信息', async () => {
    const req = createRequest({
      user: {
        department: [manageDpt + 99999],
        userid: otherUserid,
      },
      body: { ...doc, name: 'updated2' },
      params: { id: doc._id },
    });
    const res = createResponse();
    await acceptors.postUpdate(req, res);
    const data = res._getData();
    expect(data.ret).eql(401);
  });

  it('postUpdate 管理员能更新其他人的信息', async () => {
    const req = createRequest({
      user: {
        department: [manageDpt],
        userid: otherUserid,
      },
      body: { ...doc, name: 'updated3' },
      params: { id: doc._id },
    });
    const res = createResponse();
    await acceptors.postUpdate(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

  it('getDetail 用户可查看自己的信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: myUserid,
      },
      // 这个必须是数据库中已存在的一个id号
      params: { id: doc._id },
    });
    const res = createResponse();
    await acceptors.getDetail(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

  it('getDetail 监督员能查看他人信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt],
        userid: supervisorUserid,
      },
      params: { id: doc._id },
    });
    const res = createResponse();
    await acceptors.getDetail(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

  it('getDetail 非管理员或监督员不能查看他人信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: otherUserid,
      },
      params: { id: doc._id },
    });
    const res = createResponse();
    await acceptors.getDetail(req, res);
    const data = res._getData();
    expect(data.ret).eql(401);
  });

  it('getDetail 给定Id不存在时返回错误', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: 88,
      },
      params: { id: 'ffddd' },
    });
    const res = createResponse();
    await acceptors.getDetail(req, res);
    const data = res._getData();
    expect(data.ret).eql(-1);
  });

  it('list 普通用户可查看列表，但不包含仅有助学金记录的信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: 88,
      },
      query: {
        pageSize: 500,
      },
    });
    const res = createResponse();
    await acceptors.list(req, res);
    const result = res._getData();
    expect(result.ret).eql(0);
    if (result.data.totalCount >= 500) expect(result.data.data).have.length(500);
    result.data.data.forEach(item => {
      if (item.records) {
        expect(item.records.some.bind(item.records, rec => rec.project === '奖学金'));
      }
    });
    expect(result.ret).eql(0);
  });

  it('list 普通用户不可查看助学金信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: 88,
      },
      query: {
        project: '助学金',
      },
    });
    const res = createResponse();
    await acceptors.list(req, res);
    const result = res._getData();
    expect(result.ret).eql(401);
  });
});
