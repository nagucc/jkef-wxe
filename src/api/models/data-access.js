import { useCollection } from 'mongo-use-collection';
import { mongoUrl } from '../../config';
import { ObjectId } from 'mongodb';

export const ACCEPTORS_COLLECTION = 'acceptors';
export const STAT_BY_PROJECT = 'stat_by_project';
export const STAT_BY_YEAR = 'stat_by_year';

export const useAcceptors = cb => useCollection(mongoUrl, ACCEPTORS_COLLECTION, cb);
export const useStatByProject = cb => useCollection(mongoUrl, STAT_BY_PROJECT, cb);
export const useStatByYear = cb => useCollection(mongoUrl, STAT_BY_YEAR, cb);

export const computeStatByProject = async () =>
  new Promise((resolve, reject) => useAcceptors(async col => {
    const map = function () { // eslint-disable-line
      if (this.records) {
        this.records.forEach(function (record) { // eslint-disable-line
          if (record.isDeleted) return;
          emit(record.project, { // eslint-disable-line
            amount: record.amount / 1000,
            count: 1,
            lastUpdated: record.date,
          });
        });
      }
    };
    const reduce = function (key, values) { // eslint-disable-line
      var amount = 0, count = 0, lastUpdated = 0; // eslint-disable-line
      values.forEach(val => {
        amount += val.amount;
        count += val.count;
        lastUpdated = Math.max(lastUpdated, +val.lastUpdated);
      });
      // mongodb 中不支持shorthand
      return {
        amount: amount, // eslint-disable-line object-shorthand
        count: count, // eslint-disable-line object-shorthand
        lastUpdated: lastUpdated, // eslint-disable-line object-shorthand
      };
    };

    try {
      await col.mapReduce(map, reduce, {
        out: {
          replace: STAT_BY_PROJECT,
        },
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  }));

export const computeStatByYear = async () =>
  new Promise((resolve, reject) => {
    useAcceptors(async col => {
      const map = function () { // eslint-disable-line
        if (this.records) {
          this.records.forEach(function (record) { // eslint-disable-line
            if (record.isDeleted) return;
            emit(record.date.getYear() + 1900, { // eslint-disable-line
              amount: record.amount / 1000,
              count: 1,
              lastUpdated: record.date,
            });
          });
        }
      };
      const reduce = function (key, values) { // eslint-disable-line
        var amount = 0, count = 0, lastUpdated = 0; // eslint-disable-line
        values.forEach((val) => {
          amount += val.amount;
          count += val.count;
          lastUpdated = Math.max(lastUpdated, +val.lastUpdated);
        });
        // mongodb 中不支持shorthand
        return {
          amount: amount, // eslint-disable-line object-shorthand
          count: count, // eslint-disable-line object-shorthand
          lastUpdated: lastUpdated, // eslint-disable-line object-shorthand
        };
      };
      try {
        await col.mapReduce(map, reduce, {
          out: {
            replace: STAT_BY_YEAR,
          },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

export const getStatByProject = () =>
  new Promise(resolve => {
    useStatByProject(async col => {
      const result = await col.find().toArray();
      resolve(result);
    });
  });

export const getStatByYear = () =>
  new Promise(resolve => {
    useStatByYear(async col => {
      const result = await col.find().toArray();
      resolve(result);
    });
  });

export const findAcceptors = ({ text, year, project, projections, skip = 0, limit = 20 } = {}) => {
  let condition = { isDeleted: { $ne: true } };
  if (text) {
    var reg = new RegExp(text); // eslint-disable-line vars-on-top, no-var
    condition = Object.assign(condition, {
      $or: [{ name: reg }, { phone: reg }],
    });
  }
  if (project) {
    condition = Object.assign(condition, {
      'records.project': project,
    });
  }

  if (year) {
    year = parseInt(year, 10); // eslint-disable-line
    condition = Object.assign(condition, {
      records: {
        $elemMatch: {
          date: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
    });
  }
  return new Promise((resolve, reject) => {
    useAcceptors(async col => {
      try {
        const totalCount = await col.count(condition);
        const data = await col.find(condition, projections)
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit).toArray();
        resolve({ totalCount, data });
      } catch (e) {
        reject(e);
      }
    });
  });
};


/*
idCard.number作为唯一标识字段，添加或更新acceptor
 */
export const addAcceptor = async ({ name, isMale, phone, idCard, userid }) =>
  new Promise((resolve, reject) => {
    useAcceptors(async col => {
      if (!name) {
        reject('姓名不能为空');
        return;
      }
      if (!idCard || !idCard.type || !idCard.number) {
        reject('证件类型和号码不能为空');
        return;
      }
      try {
        const result = await col.updateOne({ 'idCard.number': idCard.number },
          { name, phone, isMale, idCard, userid },
          { upsert: true });
        if (result.result.ok === 1) resolve(result.result.upserted[0]._id);
        else reject(result.result);
      } catch (e) {
        reject(e);
      }
    });
  });

/*
通过idCard.number找到相应的acceptor
 */
export const findByIdCardNumber = async idCardNumber =>
  new Promise((resolve, reject) => {
    useAcceptors(async col => {
      try {
        const doc = await col.findOne({ 'idCard.number': idCardNumber });
        resolve(doc);
      } catch (e) {
        reject(e);
      }
    });
  });

/*
根据id查找相应的acceptor
 */
export const findById = async id =>
  new Promise((resolve, reject) => {
    useAcceptors(async col => {
      try {
        const acc = await col.findOne({ _id: new ObjectId(id) });
        resolve(acc);
      } catch (e) {
        reject(e);
      }
    });
  });

export const update = async (_id, newData) =>
  new Promise((resolve, reject) => useAcceptors(async col => {
    try {
      const { name, phone, idCard, isMale, userid } = newData;
      let query = {};
      if (name) query = { ...query, name };
      if (phone) query = { ...query, phone };
      if (isMale !== undefined) query = { ...query, isMale };
      // if (idCard) query = { ...query, idCard };
      if (idCard) {
        if (idCard.type) {
          Object.assign(query, {
            'idCard.type': idCard.type,
          });
        }
        if (idCard.number) {
          Object.assign(query, {
            'idCard.number': idCard.number,
          });
        }
      }
      if (userid) query = { ...query, userid };
      const result = await col.updateOne({ _id: new ObjectId(_id) }, {
        $set: query,
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }));

export const deleteAcceptor = id => new Promise((resolve, reject) =>
  useAcceptors(async col => {
    try {
      const result = await col.updateOne({ _id: new ObjectId(id) }, {
        $set: { isDeleted: true },
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }));

export const remove = async _id =>
  new Promise((resolve, reject) => useAcceptors(async col => {
    try {
      resolve(await col.remove({ _id: new ObjectId(_id) }));
    } catch (e) {
      reject(e);
    }
  }));
