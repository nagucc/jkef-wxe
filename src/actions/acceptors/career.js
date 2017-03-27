import { ADDED_ACCEPTOR_CAREER,
  DELETED_ACCEPTOR_CAREER,
  INIT_ACCEPTOR_CAREER_HISTORY } from '../../constants';
import { fetchFailed, fetching } from '../common';
import fetch from '../../core/fetch';

export const addCareer = (id, career) =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    try {
      const res = await fetch(`/api/acceptors/career/${id}`, {
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify(career),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.ret === 0) {
        dispatch({
          type: ADDED_ACCEPTOR_CAREER,
          career,
        });
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

export const deleteCareer = (id, career) =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    try {
      const res = await fetch(`/api/acceptors/career/${id}`, {
        credentials: 'same-origin',
        method: 'DELETE',
        body: JSON.stringify(career),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.ret === 0) {
        dispatch({
          type: DELETED_ACCEPTOR_CAREER,
          career,
        });
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

export const initCareerHistory = id =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    try {
      const res = await fetch(`/api/acceptors/detail/${id}`, {
        credentials: 'same-origin',
      });
      const result = await res.json();
      if (result.ret === 0) {
        dispatch({
          type: INIT_ACCEPTOR_CAREER_HISTORY,
          careerHistory: result.data.careerHistory || [],
        });
      } else dispatch(fetchFailed(result));
    } catch (e) {
      dispatch(fetchFailed({ ret: -1, msg: e }));
      reject({ ret: -1, msg: e });
    }
  });
