import { fetchFailed, fetching } from '../common';
import fetch from '../../core/fetch';
import { ADDED_ZXJ_APPLY } from '../../constants';
import { SERVER_FAILED } from 'nagu-validates';

export const addApply = (id, zxjApply) =>
  dispatch => new Promise(async (resolve, reject) => {
    dispatch(fetching());
    let result;
    try {
      const res = await fetch(`/api/zxj-apply/${id}`, {
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify(zxjApply),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      result = await res.json();
    } catch (e) {
      result = { ret: SERVER_FAILED, msg: e };
      dispatch(fetchFailed(result));
      reject(result);
      return;
    }
    if (result.ret === 0) {
      dispatch({
        type: ADDED_ZXJ_APPLY,
        zxjApply,
      });
      resolve();
    } else {
      dispatch(fetchFailed(result));
      reject(result);
    }
  });
