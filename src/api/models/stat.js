import { SUCCESS } from 'nagu-validates';
import fetch from '../../core/fetch';
import { apiHost, error } from '../../config';

export const fetchByYear = async () => {
  const url = `${apiHost}/stat/by-year`;
  try {
    const res = await fetch(url);
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('fetchByYear错误', e.message);
    return [];
  }
};
export const fetchByProject = async () => {
  const url = `${apiHost}/stat/by-project`;
  try {
    const res = await fetch(url);
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('fetchByProject错误', e.message);
    return [];
  }
};
