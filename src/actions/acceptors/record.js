import { ADDED_ACCEPTOR_RECORD,
  DELETED_ACCEPTOR_RECORD,
  INIT_ACCEPTOR_RECORD } from '../../constants';
import { fetchFailed, fetching } from '../common';
import fetch from '../../core/fetch';
import { SUCCESS, SERVER_FAILED } from 'nagu-validates';

export const addRecord = (id, record) =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    let result;
    try {
      const res = await fetch(`/api/acceptors/record/${id}`, {
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify(record),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      result = await res.json();
    } catch (e) {
      result = { ret: SERVER_FAILED, msg: e };
    }
    if (result.ret === SUCCESS) {
      dispatch({
        type: ADDED_ACCEPTOR_RECORD,
        record: result.data,
      });
      resolve(result.data);
    } else {
      dispatch(fetchFailed(result));
      reject(result);
    }
  });

export const deleteRecord = (id, recordId) =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    let result;
    try {
      const res = await fetch(`/api/acceptors/record/${id}/${recordId}`, {
        credentials: 'same-origin',
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      result = await res.json();
    } catch (e) {
      result = { ret: SERVER_FAILED, msg: e };
    }
    if (result.ret === 0) {
      dispatch({
        type: DELETED_ACCEPTOR_RECORD,
        recordId,
      });
      resolve();
    } else {
      dispatch(fetchFailed(result));
      reject(result);
    }
  });

export const initRecords = id =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    let result;
    try {
      const res = await fetch(`/api/acceptors/detail/${id}`, {
        credentials: 'same-origin',
      });
      result = await res.json();
    } catch (e) {
      result = { ret: SERVER_FAILED, msg: e };
    }
    if (result.ret === SUCCESS) {
      dispatch({
        type: INIT_ACCEPTOR_RECORD,
        records: result.data.records || [],
        acceptor: result.data,
      });
      resolve(result.data);
    } else {
      dispatch(fetchFailed(result));
      reject(result);
    }
  });
