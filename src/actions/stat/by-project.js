import { STAT_BY_PROJECT } from '../../constants';
import fetch from '../../core/fetch';
import { fetchFailed, fetching } from '../common';
import { SERVER_FAILED } from 'nagu-validates';

const fetched = data => ({
  type: STAT_BY_PROJECT,
  data,
});

export default () => async dispatch => {
  dispatch(fetching());
  try {
    const res = await fetch('/api/stat/by-project');
    const result = await res.json();
    if (result.ret === 0) dispatch(fetched(result.data));
    else dispatch(fetchFailed(result));
  } catch (e) {
    dispatch(fetchFailed({
      ret: SERVER_FAILED,
      msg: e,
    }));
  }
};
