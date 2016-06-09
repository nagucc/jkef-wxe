/*
eslint-disable no-unused-expressions
 */
import { expect } from 'chai';
import 'babel-polyfill';
import { describe, it } from 'mocha';
// import { shallow } from 'enzyme';
import { computeStatByProject, getStatByProject,
  computeStatByYear, getStatByYear,
  findAcceptors, addAcceptor,
  findByIdCardNumber, findById,
  update, deleteAcceptor, remove } from './data-access';

describe('Data Access Functions', () => {
  it('按项目统计数据', async () => {
    try {
      await computeStatByProject();
      const result = await getStatByProject();
      expect(result.length).to.be.above(0);
      expect(result.find(item => item._id === '其他').value.amount).to.be.above(0);
    } catch (e) {
      throw e;
    }
  });
  it('按年度统计数据', async () => {
    try {
      await computeStatByYear();
      const result = await getStatByYear();
      expect(result.length).to.above(0);
      expect(result.find(item => item._id === 2008).value.amount).to.above(0);
    } catch (e) {
      throw e;
    }
  });
  it('findAcceptors 不使用参数能查出不超过20条记录', async () => {
    try {
      const { data, totalCount } = await findAcceptors();
      expect(totalCount).to.above(0);
      expect(data.length).to.below(21);
      expect(data[0].name).to.be.not.null; // eslint-disable-line no-unused-expressions
    } catch (e) {
      throw e;
    }
  });
  it('findAcceptors 使用limit参数限制取出的数目', async () => {
    try {
      const { data, totalCount } = await findAcceptors({ limit: 1 });
      expect(totalCount).to.above(0);
      expect(data.length).to.eql(1);
      expect(data[0].name).to.be.not.null; // eslint-disable-line no-unused-expressions
    } catch (e) {
      throw e;
    }
  });
  it('findAcceptors 使用skip跳过前面的内容', async () => {
    try {
      const { data, totalCount } = await findAcceptors({ skip: 99999999 });
      expect(totalCount).to.above(0);
      expect(data.length).to.eql(0);
    } catch (e) {
      throw e;
    }
  });
  it('addAcceptor 必须有name和idCard{type, number}', async () => {
    try {
      await Promise.all([
        addAcceptor({ isMale: false }),
        addAcceptor({ name: 'test', idCard: {} }),
        addAcceptor({ name: 'test', idCard: { type: 'ddd' } }),
        addAcceptor({ name: 'test', idCard: { number: 'ddd' } }),
        addAcceptor({ idCard: { number: 'ddd', type: 'dfsf' } }),
      ]);
      throw new Error('test failed');
    } catch (e) {
      expect(e).to.be.ok;
    }
  });

  it('findAcceptors 无参数查询', async () => {
    const list = await findAcceptors();
    expect(list.data.length).to.above(0);
  });
  it('findAcceptors 根据project查询，找出所有包含指定项目记录的人', async () => {
    const list = await findAcceptors({ project: '奖学金', limit: 500 });
    if (list.data.totalCount >= 500) expect(list.data.length).to.above(499);
    expect(list.data.length).to.above(0);
    list.data.forEach(doc => {
      if (doc.records) {
        expect(doc.records.some.bind(doc.records, rec => rec.project === '奖学金'));
      }
    });
  });

  it('addAcceptor idCard数据相同时覆盖原数据, 同时测试查找、更新与删除',
    async () => {
      const idCard = { type: 'test', number: Math.random().toString() };
      // 测试添加数据
      const id = await addAcceptor({ name: 'test', idCard, isMale: true });
      expect(id).to.be.ok;
      // 测试根据idCardNmuber获取数据
      const doc = await findByIdCardNumber(idCard.number);
      expect(doc.idCard.number).eql(idCard.number);
      // 更新数据
      await update(id.toString(), {
        idCard: { type: 'updated' },
        isMale: false,
      });
      // 根据Id获取数据
      const doc2 = await findById(id.toString());
      expect(doc2._id).eql(id);
      expect(doc2.isMale).to.be.false;
      expect(doc2.idCard.type).eql('updated');

      // 标记为删除
      await deleteAcceptor(id.toString());

      // 彻底删除
      await remove(id.toString());
    });
});
