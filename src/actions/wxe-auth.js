import { FETCHED_ME, ME_FETCHED_FAILED,
  USER_IS_GUEST, USER_IS_MEMBER,
  USER_IS_SUPERVISOR, USER_IS_MANAGER,
  UNAUTHORIZED } from '../constants';
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

export const setUserRole = ({ isSupervisor, isManager } = {
  signup: false,
  isSupervisor: false,
  isManager: false,
}) => {
  if (isManager) return { type: USER_IS_MANAGER };
  if (isSupervisor) return { type: USER_IS_SUPERVISOR };
  return { type: USER_IS_MEMBER };
};

export const unauthorized = () => ({
  type: UNAUTHORIZED,
});
