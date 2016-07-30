import { FETCHED_CEE_RESULT } from '../../constants';
import { fetching, fetchFailed } from '../common';
import fetch from '../../core/fetch';

const fetched = data => ({
  type: FETCHED_CEE_RESULT,
  data,
});

export const fetchCeeResult = () => async dispatch => {
  dispatch(fetching());
  try {
    const res = await fetch('/api/fundinfo/list', {
      credentials: 'same-origin',
    });
    const result = await res.json();
    dispatch(fetched(result.data));
  } catch (e) {
    dispatch(fetchFailed(e));
  }
};
