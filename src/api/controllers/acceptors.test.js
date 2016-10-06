/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-polyfill';
import { expect } from 'chai';
import { createRequest, createResponse } from 'node-mocks-http';
import { manageDpt, supervisorDpt } from '../../config';
import * as acceptors from './acceptors';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED,
  OBJECT_IS_UNDEFINED_OR_NULL } from '../../err-codes';

const myUserid = 88;
const otherUserid = 89;
const supervisorUserid = 90;
const normalUser = {
  userid: 88,
  department: [88888888],
};
const otherUser = {
  userid: 89,
  department: [99999999],
};
const manager = {
  user: 91,
  department: [manageDpt],
};
let doc;
describe('Acceptors Middlewares', () => {
  it('add 添加数据', async () => {
    const req = createRequest({
      user: normalUser,
      body: {
        _id: Math.random().toString(), // _id在添加profile的时候生成
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
  });

  it('postUpdate 用户能更新自己的信息', async () => {
    const req = createRequest({
      user: {
        department: [manageDpt + 99999],
        userid: myUserid,
      },
      body: { ...doc, idCard: { type: 'updated' } },
    });
    const res = createResponse();
    await acceptors.postUpdate(() => (doc._id))(req, res);
    const data = res._getData();
    expect(data.ret).eql(SUCCESS);
    expect(data.data._id).eql(doc._id);
  });

  it('onlyManagerAndOwnerCanDoNext 只有管理员或拥有者才可以next', async () => {
    const idGetter = req => req.params.id;

    // Owner
    const reqOwner = createRequest({
      user: normalUser,
      params: { id: doc._id },
    });
    const resOwner = createResponse();
    await acceptors.onlyManagerAndOwnerCanDoNext(idGetter)(reqOwner, resOwner);
    let data = resOwner._getData();
    expect(data.ret).to.eql(UNAUTHORIZED);

    // Other
    const reqOther = createRequest({
      user: otherUser,
      params: { id: doc._id },
    });
    const resOther = createResponse();
    await acceptors.onlyManagerAndOwnerCanDoNext(idGetter)(reqOther, resOther);
    data = resOther._getData();
    expect(data.ret).to.eql(UNAUTHORIZED);

    // Manager
    const reqManager = createRequest({
      user: manager,
      params: { id: doc._id },
    });
    const resManager = createResponse();
    await acceptors.onlyManagerAndOwnerCanDoNext(idGetter)(reqManager, resManager);
    data = resManager._getData();
    expect(data).to.be.not.ok;
  });

  it('postUpdate 更新信息', async () => {
    const req = createRequest({
      body: { ...doc, name: 'updated3' },
    });
    const res = createResponse();
    await acceptors.postUpdate(() => doc._id)(req, res);
    const data = res._getData();
    expect(data.ret).eql(SUCCESS);
  });

  it('getDetail 用户可查看自己的信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: myUserid,
      },
    });
    const res = createResponse();
    await acceptors.getDetail(() => doc._id, () => true)(req, res);
    const data = res._getData();
    expect(data.ret).eql(SUCCESS);
  });

  it('getDetail 监督员能查看他人信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt],
        userid: supervisorUserid,
      },
    });
    const res = createResponse();
    await acceptors.getDetail(() => doc._id,
      () => true)(req, res);
    const data = res._getData();
    expect(data.ret).eql(SUCCESS);
  });

  it('getDetail 非管理员或监督员不能查看他人信息', async () => {
    const req = createRequest({
      user: {
        department: [supervisorDpt + 999999],
        userid: otherUserid,
      },
    });
    const res = createResponse();
    await acceptors.getDetail(() => doc._id, () => false)(req, res);
    const data = res._getData();
    expect(data.ret).eql(UNAUTHORIZED);
  });

  it('list 普通用户不可查看列表', async () => {
    const req = createRequest({
      user: normalUser,
      query: {
        pageSize: 500,
      },
    });
    const res = createResponse();
    await acceptors.list(req, res);
    const result = res._getData();
    expect(result.ret).eql(UNAUTHORIZED);
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

  it('putEdu body中必须提供name和year参数', async () => {
    const req = createRequest({
      body: {},
      user: normalUser,
    });
    const res = createResponse();
    await acceptors.putEdu(() => doc._id)(req, res);
    const data = res._getData(res);
    expect(data.ret).eql(UNKNOWN_ERROR);
  });

  const rawEdu = {
    name: '云南大学',
    degree: '硕士',
    year: '2001',
  };

  it('putEdu 用户可添加教育经历', async () => {
    const req = createRequest({
      body: rawEdu,
    });
    const res = createResponse();
    await acceptors.putEdu(() => doc._id)(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

  it('deleteEdu body中必须提供name和year参数', async () => {
    const req = createRequest({
      body: {},
      user: normalUser,
    });
    const res = createResponse();
    await acceptors.deleteEdu()(req, res);
    const data = res._getData(res);
    expect(data.ret).eql(-1);
  });

  it('deleteEdu 用户可删除教育经历', async () => {
    const req = createRequest({
      body: rawEdu,
    });
    const res = createResponse();
    await acceptors.deleteEdu(() => doc._id)(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

  it('putCareer body中必须提供name和year参数', async () => {
    const req = createRequest({
      body: {},
      user: normalUser,
    });
    const res = createResponse();
    await acceptors.putCareer(() => doc._id)(req, res);
    const data = res._getData(res);
    expect(data.ret).eql(-1);
  });

  const rawCareer = rawEdu;

  it('putCareer 用户可添加工作经历', async () => {
    const req = createRequest({
      body: rawCareer,
    });
    const res = createResponse();
    await acceptors.putCareer(() => doc._id)(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

  it('deleteCareer body中必须提供name和year参数', async () => {
    const req = createRequest({
      body: {},
      user: normalUser,
    });
    const res = createResponse();
    await acceptors.deleteCareer(() => doc._id)(req, res);
    const data = res._getData(res);
    expect(data.ret).eql(-1);
  });

  it('deleteCareer 用户可删除教育经历', async () => {
    const req = createRequest({
      body: rawEdu,
    });
    const res = createResponse();
    await acceptors.deleteCareer(() => doc._id)(req, res);
    const data = res._getData();
    expect(data.ret).eql(0);
  });

});
