import { FETCH_FAILED, FETCHING, RESET } from '../constants';

export const fetchFailed = error => ({
  type: FETCH_FAILED,
  error,
});

export const fetching = (data = null) => ({
  type: FETCHING,
  data,
});

export const timeout = (microsecends, action) => dispatch =>
  setTimeout(() => dispatch(action), microsecends);

export const reset = () => ({
  type: RESET,
});
