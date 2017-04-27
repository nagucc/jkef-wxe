import * as model from './acceptors';
import cacheProxy from './memory-cache-proxy';
import * as cacheKey from './cache-key';

export const getById = id => cacheProxy(model.getById, {
  key: cacheKey.acceptor(id),
  expire: 24 * 3600 * 1000, // 1 day
}, [id]);
