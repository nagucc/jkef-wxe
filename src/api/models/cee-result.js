import { useCollection } from 'mongo-use-collection';
import { mongoUrl } from '../../config';

export const CEE_RESULT_COLLECTION = 'fundinfos';

export const useCeeResult = cb => useCollection(mongoUrl, CEE_RESULT_COLLECTION, cb);

export const list = () =>
  new Promise((resolve, reject) => useCeeResult(async col => {
    try {
      const result = await col.find().toArray();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }));
