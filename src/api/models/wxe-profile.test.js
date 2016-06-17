/*
eslint-env mocha
 */
 /*
 eslint-disable no-unused-expressions
  */
import { expect } from 'chai';
import 'babel-polyfill';

import dao from './wxe-profile';

const userid = Math.random().toString();
describe('Profile Data Access', () => {
  const profile = {
    userid,
    roles: [3, 5],
  };

  it('add 必须有userid', async () => {
    try {
      await dao.add();
      throw new Error('test failed');
    } catch (e) {
      expect(e).to.eql('必须有userid');
    }
  });

  it('add 正常添加数据', async () => {
    const result = await dao.add(profile);
    expect(result).to.be.ok;
  });
  it('getByUserId 根据userid可获取数据', async () => {
    const { _id, ...result } = await dao.getByUserId(userid);
    expect(_id).to.be.ok;
    expect(result).to.eql(profile);
  });
  it('update 正确更新', async () => {
    const updated = { ...profile, roles: [3] };
    await dao.update(updated);
    const { _id, ...result } = await dao.getByUserId(userid);
    expect(_id).to.be.ok;
    expect(result).to.eql(updated);
  });

  it('remove 正确删除', async () => {
    await dao.remove(userid);
    const doc = await dao.getByUserId(userid);
    expect(doc).to.be.null;
  });
});
