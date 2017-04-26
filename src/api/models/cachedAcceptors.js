import * as model from './acceptors';
import cacheProxy from './memory-cache-proxy';

export const getById = id => cacheProxy(model.getById, {
  key: `jkef:acceptors:detail:${id}`,
  expire: 24 * 3600 * 1000, // 1 day
}, [id]);
