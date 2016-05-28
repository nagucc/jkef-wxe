import { FETCHED_ME, ME_FETCHED_FAILED } from '../constants';
import fetch from '../core/fetch';

const fetchedMe = me => ({
  type: FETCHED_ME,
  me,
});

const fetchFailed = err => ({
  type: ME_FETCHED_FAILED,
  err,
});

export const getMe = () => async dispatch => {
  try {
    const res = await fetch('/api/wxe-auth/me', {
      credentials: 'same-origin',
    });
    const result = await res.json();
    if (result.ret === 0) dispatch(fetchedMe(result.data));
    else dispatch(fetchFailed(result));
  } catch (e) {
    dispatch(fetchFailed(e));
  }
};
