import {useCollection} from 'mongo-use-collection';
import {mongoUrl} from '../../config';

export const ACCEPTORS_COLLECTION = 'acceptors';
export const STAT_BY_PROJECT = 'stat_by_project';

export const useAcceptors = cb => useCollection(mongoUrl, ACCEPTORS_COLLECTION, cb);
export const useStatByProject = cb => useCollection(mongoUrl, STAT_BY_PROJECT, cb);

export const computeStatByProject = async () => {
  return new Promise((resolve,reject) => useAcceptors(async col => {
    let map = function (){
      if(this.records){
        this.records.forEach(function (record) {
          if(record.isDeleted) return;
          emit(record.project, {
            amount: record.amount / 1000,
            count: 1
          });
        });
      }
    };
    let reduce = function (key, values) {
      var amount = 0, count = 0;
      values.forEach(val => {
        amount += val.amount;
        count += val.count;
      });
      return {amount, count};
    };

    await col.mapReduce(map, reduce, {
      out: {
        replace: STAT_BY_PROJECT
      }
    });
    resolve();
  }));
}

export const getStatByProject = () => {
  return new Promise((resolve, reject) => {
    useStatByProject(async col => {
      let result = await col.find().toArray();
      resolve(result);
    });
  });
};
