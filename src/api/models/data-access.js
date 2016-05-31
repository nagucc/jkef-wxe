import { useCollection } from 'mongo-use-collection';
import { mongoUrl } from '../../config';

export const ACCEPTORS_COLLECTION = 'acceptors';
export const STAT_BY_PROJECT = 'stat_by_project';
export const STAT_BY_YEAR = 'stat_by_year';

export const useAcceptors = cb => useCollection(mongoUrl, ACCEPTORS_COLLECTION, cb);
export const useStatByProject = cb => useCollection(mongoUrl, STAT_BY_PROJECT, cb);
export const useStatByYear = cb => useCollection(mongoUrl, STAT_BY_YEAR, cb);

export const computeStatByProject = async () =>
  new Promise(resolve => useAcceptors(async col => {
    const map = function () {
      if (this.records) {
        this.records.forEach(function (record) {
          if (record.isDeleted) return;
          emit(record.project, {
            amount: record.amount / 1000,
            count: 1,
            lastUpdated: record.date,
          });
        });
      }
    };
    const reduce = function (key, values) {
      var amount = 0, count = 0, lastUpdated = 0;
      values.forEach(val => {
        amount += val.amount;
        count += val.count;
        lastUpdated = Math.max(lastUpdated, +val.lastUpdated);
      });
      return { amount, count, lastUpdated };
    };

    await col.mapReduce(map, reduce, {
      out: {
        replace: STAT_BY_PROJECT,
      },
    });
    resolve();
  }));


export const computeStatByYear = async () => {
  return new Promise(function (resolve, reject) {
    useAcceptors(async col => {
      let map = function () {
        if (this.records) {
          this.records.forEach(function (record) {
            if (record.isDeleted) return;
            emit(record.date.getYear() + 1900, {
              amount: record.amount / 1000,
              count: 1,
              lastUpdated: record.date,
            });
          });
        }
      };
      let reduce = function (key, values) {
        var amount = 0, count = 0, lastUpdated = 0;
        values.forEach((val) => {
          amount += val.amount;
          count += val.count;
          lastUpdated = Math.max(lastUpdated, +val.lastUpdated);
        });
        return { amount, count, lastUpdated };
      };
      await col.mapReduce(map, reduce, {
        out: {
          replace: STAT_BY_YEAR,
        },
      });
      resolve();
    });
  });
};

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

export const findAcceptors = ({ text, year, project, projections, skip, limit } = {
  skip: 0,
  limit: 20,
}) => {
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

const mustBeProvided = () => {
  throw new Error('参数必须提供');
};

/*
idCard.number作为唯一标识字段，添加或更新acceptor
 */
export const addAcceptor = async ({ name, isMale, phone, idCard } = {
  name: mustBeProvided(),
  isMale: null,
  mobile: mustBeProvided(),
  idCard: mustBeProvided(),
}) => new Promise((resolve, reject) => {
  useAcceptors(async col => {
    try {
      const doc = await col.updateOne({ 'idCard.number': idCard.number }, {
        $set: { name, phone, isMale, idCard },
      }, { upsert: true });
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
});

/*
通过idCard.number找到相应的acceptor
 */
export const findAcceptorByIdCardNumber = async idCardNumber =>
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
