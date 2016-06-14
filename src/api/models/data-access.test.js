/*
eslint-env mocha
 */
/*
eslint-disable no-unused-expressions
 */
import { expect } from 'chai';
import 'babel-polyfill';
import { computeStatByProject, getStatByProject,
  computeStatByYear, getStatByYear,
  findAcceptors, addAcceptor,
  findByIdCardNumber, findById,
  update, remove, trash,
  addEdu, removeEdu } from './data-access';

describe('Data Access Functions', () => {
  const rawDoc = {
    name: 'test',
    idCard: {
      type: 'type',
      number: Math.random(),
    },
    isMale: false,
    phone: '43434',
    userid: 'useridtest',
  };

  const updatedDoc = {
    name: 'testUpdatd',
    idCard: {
      type: 'typeUpdated',
      number: Math.random(),
    },
    isMale: true,
    phone: '4534updated',
    userid: 'useridtestUpdated',
  };

  let docId;

  it('addAcceptor 必须有name和idCard{type, number}', async () => {
    try {
      await Promise.all([
        addAcceptor({ name: 'test' }),
        addAcceptor({ name: 'test', idCard: {} }),
        addAcceptor({ name: 'test', idCard: { type: 'ddd' } }),
        addAcceptor({ name: 'test', idCard: { number: 'ddd' } }),
        addAcceptor({ idCard: { number: 'ddd', type: 'dfsf' } }),
        Promise.reject('success'),
      ]);
      throw new Error('test failed');
    } catch (e) {
      expect(e).to.eql('success');
    }
  });

  it('addAcceptor 添加Acceptor, 正常返回_id', async () => {
    docId = await addAcceptor(rawDoc);
    expect(docId).to.be.ok;
  });

  it('findById 可根据Id返回数据', async () => {
    const gettedDoc = await findById(docId);
    const { _id, ...data } = gettedDoc;
    expect(_id).eql(docId);
    expect(data).to.eql(rawDoc);
  });

  it('addEdu 添加教育经历，name和year不能为空, year必须可转变为Number类型', async () => {
    try {
      await Promise.all([
        addEdu(docId),
        addEdu(docId, {}),
        addEdu(docId, { name: 'test' }),
        addEdu(docId, { year: 2001 }),
        addEdu(docId, { year: '2001.4' }),
        Promise.reject('success'),
      ]);
    } catch (e) {
      expect(e).to.eql('success');
    }
  });

  const edu = {
    name: '云南大学',
    year: 2001,
  };
  it('addEdu 可正常添加教育经历，同一个_id的eduHistory只能包含一组相同的name和year', async () => {
    await addEdu(docId, edu);
    await addEdu(docId, edu);
    const gettedDoc = await findById(docId);
    expect(gettedDoc.eduHistory).to.have.lengthOf(1);
    expect(gettedDoc.eduHistory[0]).eql(edu);
  });

  it('findByIdCardNumber 可根据idCard.number找到数据', async () => {
    const gettedDoc = await findByIdCardNumber(rawDoc.idCard.number);
    const { _id, eduHistory, ...data } = gettedDoc;
    expect(_id).eql(docId);
    expect(eduHistory[0]).eql(edu);
    expect(data).to.eql(rawDoc);
  });

  it('addAcceptor 当保存相同idCard.number的acceptor时，添加失败', async () => {
    const newDoc = {
      ...rawDoc,
      phone: 'updated22',
    };
    try {
      await addAcceptor(newDoc);
      throw new Error('不应该运行到这里');
    } catch (e) {
      expect(e).to.be.ok;
    }
  });

  it('update 可根据_id更新数据，但不会更新_id字段', async () => {
    await update(docId, { _id: docId, ...updatedDoc });
    const { eduHistory, ...gettedDoc } = // eslint-disable-line no-unused-vars
      await findByIdCardNumber(updatedDoc.idCard.number);
    expect(gettedDoc).to.eql({ _id: docId, ...updatedDoc });
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

  it('trash 将数据标识为删除状态，但暂不从数据库中删除', async () => {
    await trash(docId);
    const gettedDoc = await findById(docId);
    const { isDeleted, eduHistory, ...data } = gettedDoc; // eslint-disable-line no-unused-vars
    expect(isDeleted).to.be.true;
    expect(data).eql({ _id: docId, ...updatedDoc });
  });

  it('removeEdu 正常删除教育经历', async () => {
    await removeEdu(docId, edu);
    const gettedDoc = findById(docId);
    expect(gettedDoc.eduHistory).to.be.undefined;
    await removeEdu(docId, edu);
  });

  it('remove 彻底删除数据', async () => {
    await remove(docId);
    const gettedDoc = await findById(docId);
    expect(gettedDoc).to.be.null;
  });
});
