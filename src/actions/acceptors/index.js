import { FETCHED_ACCEPTOR_BY_ID } from '../../constants';
import fetch from '../../core/fetch';
import { fetchFailed, fetching, fetchDone } from '../common';
import { SERVER_FAILED } from 'nagu-validates';

export const updateAcceptor = (id, data) => async (dispatch) => {
  dispatch(fetching());
  try {
    const res = await fetch(`/api/acceptors/${id}`, {
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (result.ret === 0) {
      dispatch(fetchDone(result.data));
      return Promise.resolve(result.data);
    }
    dispatch(fetchFailed(result));
    return Promise.reject(result);
  } catch (e) {
    const result = {
      ret: SERVER_FAILED,
      msg: e,
    };
    dispatch(fetchFailed(result));
    return Promise.reject(result);
  }
};
