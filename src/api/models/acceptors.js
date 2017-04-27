import { SUCCESS } from 'nagu-validates';
import fetch from '../../core/fetch';
import { apiHost, error, info, apiToken } from '../../config';
import * as cacheKey from './cache-key';
import * as cache from './memory-cache-proxy';

export const list = async (pageIndex = 0, pageSize = 10) => {
  const url = `${apiHost}/acceptors/list/${pageIndex}?pageSize=${pageSize}&token=${apiToken}`;
  info('fetch from url:', url);
  try {
    const res = await fetch(url);
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('listAcceptors错误', e.message);
    return null;
  }
};

export const getById = async (id) => {
  const url = `${apiHost}/acceptors/${id}?token=${apiToken}`;
  info('fetch from url:', url);
  try {
    const res = await fetch(url);
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${JSON.stringify(result)}`);
  } catch (e) {
    error('getById - Acceptor错误', e.message);
    return null;
  }
};

export const add = async (acceptor) => {
  const url = `${apiHost}/acceptors/?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(acceptor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('add - Acceptor错误', e.message);
    return null;
  }
};

export const addEdu = async (id, edu) => {
  const url = `${apiHost}/acceptors/edu/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(edu),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) {
      cache.del(cacheKey.acceptor(id));
      return result.data;
    }
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('addEdu - Acceptor错误', e.message);
    return null;
  }
};

export const removeEdu = async (id, edu) => {
  const url = `${apiHost}/acceptors/edu/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(edu),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) {
      cache.del(cacheKey.acceptor(id));
      return result.data;
    }
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('removeEdu - Acceptor错误', e.message);
    return null;
  }
};

export const addCareer = async (id, career) => {
  const url = `${apiHost}/acceptors/career/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(career),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('addCareer - Acceptor错误', e.message);
    return null;
  }
};

export const removeCareer = async (id, career) => {
  const url = `${apiHost}/acceptors/career/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(career),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('removeCareer - Acceptor错误', e.message);
    return null;
  }
};

export const addRecord = async (id, record) => {
  const url = `${apiHost}/acceptors/record/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(record),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('addRecord - Acceptor错误', e.message);
    return null;
  }
};

export const removeRecord = async (id, record) => {
  const url = `${apiHost}/acceptors/record/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(record),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('removeRecord - Acceptor错误', e.message);
    return null;
  }
};

export const update = async (id, acceptor) => {
  const url = `${apiHost}/acceptors/${id}?token=${apiToken}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(acceptor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === SUCCESS) return result.data;
    throw new Error(`服务器返回错误：${result.msg}`);
  } catch (e) {
    error('update - Acceptor错误', e.message);
    return null;
  }
};
