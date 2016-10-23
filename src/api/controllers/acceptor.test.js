/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-polyfill';
import { expect } from 'chai';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_UNDEFINED_OR_NULL, OBJECT_ALREADY_EXISTS, INVALID_INTEGER } from 'nagu-validates';
import request from 'supertest';
import app from '../express-for-test';
import acceptorsCtrl from './acceptors';
import { profileManager2 as profileManager,
  manageDpt, supervisorDpt } from '../../config';

app.use('/api/acceptors', acceptorsCtrl);

const agent = request.agent(app);
const getUserIdCookie = async (userName = Math.random()) => {
  const res = await agent.get(`/signedUserIdCookie?userid=${userName}`);
  return res.headers['set-cookie'];
};
const testUser = Math.random().toString();
const testManager = Math.random().toString();
const testSupervisor = Math.random().toString();

describe('Acceptor Middlewares', () => {
  before(async () => {
    await profileManager.add({
      name: 'testManager',
      userid: testManager,
      roles: [manageDpt],
    });
    await profileManager.add({
      name: 'testSupervisor',
      userid: testSupervisor,
      roles: [supervisorDpt],
    });
  });
  after(async () => {
    const manager = await profileManager.getByUserId(testManager);
    await profileManager.remove(manager._id);
    const supervisor = await profileManager.getByUserId(testSupervisor);
    await profileManager.remove(supervisor._id);
  });
  const rawAcceptor = {
    name: 'tst',
    isMale: true,
    phone: '14356785443',
    userid: testUser,
    idCard: { type: 'test', number: Math.random() },
  };
  describe('PUT /add', () => {
    it('未登录，返回错误代码', async () => {
      const res = await agent.put('/api/acceptors/add').send(rawAcceptor);
      expect(res.body.ret).to.eql(UNKNOWN_ERROR);
    });
    it('普通用户登录之后正常添加acceptor, userid只能是自己', async () => {
      const cookie = await getUserIdCookie(testUser);
      const res = await agent.put('/api/acceptors/add')
        .set('Cookie', cookie)
        .send({ ...rawAcceptor, userid: 'wrongid' });
      const { ret, data } = res.body;
      expect(ret).to.eql(SUCCESS);
      expect(data._id).to.be.ok;
      rawAcceptor._id = data._id;
      expect(data.userid).to.eql(testUser);
    });
    it('重复idCard.number不能插入', async () => {
      const cookie = await getUserIdCookie();
      const res = await agent.put('/api/acceptors/add').set('Cookie', cookie).send(rawAcceptor);
      expect(res.body.ret).to.eql(OBJECT_ALREADY_EXISTS);
    });
    // 资料不全不能插入数据，返回错误代码
    // name 和 idCard.number是必须字段。
    [
      {}, // 空数据
      { name: 'name' }, // 没有idCard
      { idCard: { type: 'test', number: 'number' } }, // 没有name
      { name: 'name', idCard: { type: 'type' } }, // 没有number
    ].map(acceptor => it('资料不全不能插入数据，返回错误代码', async () => {
      const cookie = await getUserIdCookie();
      const res = await agent.put('/api/acceptors/add').set('Cookie', cookie).send(acceptor);
      expect(res.body.ret).to.eql(OBJECT_IS_UNDEFINED_OR_NULL);
    }));
  });
  describe('GET /detail/:id', () => {
    it('未登录时，无法取到数据', async () => {
      const res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`).set('Cookie', null);
      expect(res.body.ret).to.eql(UNKNOWN_ERROR);
    });
    it('普通用户没有权限读取他人profile', async () => {
      const cookie = await getUserIdCookie();
      const res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`)
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(UNAUTHORIZED);
    });
    it('自己可以查看自己的信息', async () => {
      const cookie = await getUserIdCookie(testUser);
      const res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`)
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(0);
    });
    it('ProfileId不正确时发生错误', async () => {
      const cookie = await getUserIdCookie(testUser);
      const res = await agent.get('/api/acceptors/detail/test')
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(OBJECT_IS_UNDEFINED_OR_NULL);
    });
    it('Supervisor可以查看信息', async () => {
      const cookie = await getUserIdCookie(testSupervisor);
      const res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`)
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(0);
    });
    it('Manager可以查看信息', async () => {
      const cookie = await getUserIdCookie(testManager);
      const res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`)
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(0);
    });
  });
  describe('GET /list/:pageIndex', () => {
    it('未登录时，无法取到数据', async () => {
      const res = await agent.get('/api/acceptors/list/0').set('Cookie', null);
      expect(res.body.ret).to.eql(UNKNOWN_ERROR);
    });
    it('普通用户无法获取列表', async () => {
      const cookie = await getUserIdCookie();
      const res = await agent.get('/api/acceptors/list/0')
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(UNAUTHORIZED);
    });
    it('Supervisor可以查看信息', async () => {
      const cookie = await getUserIdCookie(testSupervisor);
      const res = await agent.get('/api/acceptors/list/0')
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(0);
    });
    it('Manager可以查看信息', async () => {
      const cookie = await getUserIdCookie(testManager);
      const res = await agent.get('/api/acceptors/list/0')
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(0);
    });
    // 错误处理
    [
      {
        pageIndex: -1,
        ret: INVALID_INTEGER,
      }, {
        pageSize: -1,
        ret: INVALID_INTEGER,
      },
    ].map(item => it(`错误处理，错误代码：${item.ret}`, async () => {
      const cookie = await getUserIdCookie(testManager);
      const res = await agent.get(`/api/acceptors/list/${item.pageIndex}`)
        .set('Cookie', cookie)
        .query(item);
      expect(res.body.ret).to.eql(item.ret);
    }));
  });
  describe('POST /:id', () => {
    it('未登录时，无法操作', async () => {
      const res = await agent.post(`/api/acceptors/${rawAcceptor._id}`)
        .set('Cookie', null);
      expect(res.body.ret).to.eql(UNKNOWN_ERROR);
    });
    it('普通用户没有权限更新他人数据', async () => {
      const cookie = await getUserIdCookie();
      const res = await agent.post(`/api/acceptors/${rawAcceptor._id}`)
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(UNAUTHORIZED);
    });
    it('Supervisor没有权限更新他人数据', async () => {
      const cookie = await getUserIdCookie(testSupervisor);
      const res = await agent.post(`/api/acceptors/${rawAcceptor._id}`)
        .set('Cookie', cookie);
      expect(res.body.ret).to.eql(UNAUTHORIZED);
    });
    it('普通用户可以更新自己数据，但忽略name和userid', async () => {
      const cookie = await getUserIdCookie(testUser);
      let res = await agent.post(`/api/acceptors/${rawAcceptor._id}`)
        .set('Cookie', cookie)
        .send({
          name: 'updated',
          userid: 'updated',
          other: 'updated',
        });
      expect(res.body.ret).to.eql(SUCCESS);
      res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`);
      expect(res.body.data.name).to.eql(rawAcceptor.name);
      expect(res.body.data.userid).to.eql(rawAcceptor.userid);
      expect(res.body.data.other).to.eql('updated');
    });
    it('Manager可以他人数据', async () => {
      const cookie = await getUserIdCookie(testManager);
      let res = await agent.post(`/api/acceptors/${rawAcceptor._id}`)
        .set('Cookie', cookie)
        .send({
          name: 'updated',
          userid: 'updated',
          other: 'updated',
        });
      expect(res.body.ret).to.eql(SUCCESS);
      res = await agent.get(`/api/acceptors/detail/${rawAcceptor._id}`);
      expect(res.body.data.name).to.eql('updated');
      expect(res.body.data.userid).to.eql('updated');
      expect(res.body.data.other).to.eql('updated');
    });
  });
});
