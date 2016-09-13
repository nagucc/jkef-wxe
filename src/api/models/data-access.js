import { useCollection } from 'mongo-use-collection';
import { mongoUrl, showLog, profileCollection, profileManager } from '../../config';

const { all } = Promise;

export const ACCEPTORS_COLLECTION = 'acceptors';
export const STAT_BY_PROJECT = 'stat_by_project';
export const STAT_BY_YEAR = 'stat_by_year';

export const useAcceptors = cb => useCollection(mongoUrl, ACCEPTORS_COLLECTION, cb);
export const useStatByProject = cb => useCollection(mongoUrl, STAT_BY_PROJECT, cb);
export const useStatByYear = cb => useCollection(mongoUrl, STAT_BY_YEAR, cb);
const useProfiles = cb => useCollection(mongoUrl, profileCollection, cb);

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

export const findAcceptors = async ({ text, year, project, projections, skip = 0, limit = 20 } = {}) => {
  showLog && console.time('findAcceptors from Profiles');
  let condition = { isAcceptor: true };
  if (text) {
    const reg = new RegExp(text);
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

  const { find, count } = profileManager;
  try {
    const result = await all([count(condition), find(condition)]);
    console.log('result::::::::', result);
    return Promise.resolve({
      totalCount: result[0],
      data: result[1],
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

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
idCard.number作为唯一标识字段，添加或更新acceptor
当idCard.number重复时，reject
至存储核心数据，其他数据移到profile中
 */
export const addAcceptor = async ({ _id, idCard } = {}) =>
  new Promise((resolve, reject) => {
    useAcceptors(async col => {
      if (!idCard || !idCard.type || !idCard.number) {
        reject('证件类型和号码不能为空');
        return;
      }
      try {
        const doc = await findByIdCardNumber(idCard.number);
        if (doc) {
          reject(`idCard.number为${idCard.number}的数据已存在`);
          return;
        }
        const result = await col.updateOne({ 'idCard.number': idCard.number },
          { _id, idCard },
          { upsert: true });
        if (result.result.ok === 1) resolve(result.upsertedId._id);
        else reject(result.result);
      } catch (e) {
        reject(e);
      }
    });
  });


/*
根据id查找相应的acceptor
 */
export const findById = async _id =>
  new Promise((resolve, reject) => {
    useAcceptors(async col => {
      try {
        const acc = await col.findOne({ _id });
        resolve(acc);
      } catch (e) {
        reject(e);
      }
    });
  });

export const update = async (_id, newData) =>
  new Promise((resolve, reject) => useAcceptors(async col => {
    try {
      const { idCard } = newData;
      const query = {};
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
      const result = await col.updateOne({ _id }, {
        $set: query,
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }));

/*
将数据标记为已删除（isDeleted)
 */
export const trash = _id => new Promise((resolve, reject) =>
  useAcceptors(async col => {
    try {
      const result = await col.updateOne({ _id }, {
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
      resolve(await col.remove({ _id }));
    } catch (e) {
      reject(e);
    }
  }));

/*
为_id添加教育经历
 */
export const addEdu = async (_id, eduHistory) =>
  new Promise((resolve, reject) => {
    if (!eduHistory) {
      Promise.reject('必须提供eduHistory数据');
      return;
    }
    useAcceptors(async col => {
      try {
        await col.updateOne({ _id }, {
          $addToSet: { eduHistory },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

export const removeEdu = async (_id, eduHistory) =>
  new Promise((resolve, reject) =>
    useAcceptors(async col => {
      try {
        const oldDoc = await findById(_id);
        const filtered = oldDoc.eduHistory.filter(edu =>
          !(edu.name === eduHistory.name && edu.year === eduHistory.year));
        await col.updateOne({ _id }, {
          $set: {
            eduHistory: filtered,
          },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    }));


/*
为_id添加工作经历
 */
export const addCareer = async (_id, careerHistory) =>
  new Promise((resolve, reject) => {
    if (!careerHistory
        || !careerHistory.name
        || !careerHistory.year
        || isNaN(parseInt(careerHistory.year, 10))) {
      Promise.reject('name和year必须存在，且year必须是整数');
      return;
    }
    useAcceptors(async col => {
      try {
        await col.updateOne({ _id }, {
          $addToSet: { careerHistory },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

export const removeCareer = async (_id, careerHistory) =>
  new Promise((resolve, reject) =>
    useAcceptors(async col => {
      try {
        const oldDoc = await findById(_id);
        oldDoc.careerHistory = oldDoc.careerHistory.filter(career =>
          career.name !== careerHistory.name || career.year !== careerHistory);
        await col.updateOne({ _id }, {
          $set: {
            careerHistory: oldDoc.careerHistory,
          },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    }));

/*
为_id添加受赠记录
 */
export const addRecord = async (_id, record) =>
  new Promise((resolve, reject) => {
    if (!record
        || !record.project
        || isNaN(parseFloat(record.amount, 10))) {
      Promise.reject('所给数据不完整');
      return;
    }
    useAcceptors(async col => {
      try {
        await col.updateOne({ _id }, {
          $addToSet: { records: record },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

export const removeRecord = async (_id, recordId) =>
  new Promise((resolve, reject) =>
    useAcceptors(async col => {
      try {
        const oldDoc = await findById(_id);
        const records = oldDoc.records.filter(record =>
          record._id !== recordId);
        await col.updateOne({ _id }, {
          $set: { records },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    }));
