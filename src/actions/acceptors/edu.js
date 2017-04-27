import { ADDED_ACCEPTOR_EDU,
  DELETED_ACCEPTOR_EDU,
  INIT_ACCEPTOR_EDU_HISTORY } from '../../constants';
import { fetchFailed, fetching, fetchDone } from '../common';
import fetch from '../../core/fetch';

export const addEdu = (id, edu) =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    try {
      const res = await fetch(`/api/acceptors/edu/${id}`, {
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify(edu),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.ret === 0) {
        dispatch({
          type: ADDED_ACCEPTOR_EDU,
          edu,
        });
        dispatch(fetchDone());
        resolve();
      } else {
        dispatch(fetchFailed(result));
        reject(result);
      }
    } catch (e) {
      const result = { ret: -1, msg: e };
      dispatch(fetchFailed(result));
      reject(result);
    }
  });

export const deleteEdu = (id, edu) =>
  dispatch => new Promise(async (resolve, reject) => {
    console.log('##@', edu);
    dispatch(fetching());
    try {
      const res = await fetch(`/api/acceptors/edu/${id}`, {
        credentials: 'same-origin',
        method: 'DELETE',
        body: JSON.stringify(edu),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.ret === 0) {
        dispatch({
          type: DELETED_ACCEPTOR_EDU,
          edu,
        });
        dispatch(fetchDone());
        resolve();
      } else {
        dispatch(fetchFailed(result));
        reject(result);
      }
    } catch (e) {
      dispatch(fetchFailed({ ret: -1, msg: e }));
      reject({ ret: -1, msg: e });
    }
  });

export const initEduHistory = id =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    try {
      const res = await fetch(`/api/acceptors/detail/${id}`, {
        credentials: 'same-origin',
      });
      const result = await res.json();
      if (result.ret === 0) {
        dispatch({
          type: INIT_ACCEPTOR_EDU_HISTORY,
          eduHistory: result.data.eduHistory || [],
        });
        dispatch(fetchDone());
      } else dispatch(fetchFailed(result));
    } catch (e) {
      dispatch(fetchFailed({ ret: -1, msg: e }));
      reject({ ret: -1, msg: e });
    }
  });
