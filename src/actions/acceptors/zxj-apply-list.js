import { ZXJ_APPLY_LIST_FETCHED } from '../../constants';
import fetch from '../../core/fetch';
import { SERVER_FAILED } from 'nagu-validates';

export const fetchZxjApplyList = (params = {}) =>
  dispatch => new Promise(async (resolve, reject) => {
    let result;
    try {
      const res = await fetch('/api/zxj-apply/list', {
        credentials: 'same-origin',
        body: JSON.stringify(params),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      result = await res.json();
    } catch (msg) {
      result = { ret: SERVER_FAILED, msg };
      reject(result);
      return;
    }
    if (result.ret === 0) {
      dispatch({
        type: ZXJ_APPLY_LIST_FETCHED,
        data: result.data,
      });
      resolve(result.data);
    } else {
      reject(result);
    }
  });
