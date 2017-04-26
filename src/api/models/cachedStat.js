import * as model from './stat';
import cacheProxy from './memory-cache-proxy';

export const fetchByYear = () => cacheProxy(model.fetchByYear, {
  key: 'jkef:stat:by-year',
  expire: 24 * 3600 * 1000, // 1 day
}, []);

export const fetchByProject = () => cacheProxy(model.fetchByProject, {
  key: 'jkef:stat:by-project',
  expire: 24 * 3600 * 1000, // 1 day
}, []);
