import { FETCHED_ACCEPTOR_BY_ID } from '../../constants';
import fetch from '../../core/fetch';
import { fetchFailed, fetching } from '../common';
import { SERVER_FAILED } from 'nagu-validates';

const fetched = acceptor => ({
  type: FETCHED_ACCEPTOR_BY_ID,
  acceptor,
});

export const fetchAcceptor = id => async dispatch => {
  dispatch(fetching());
  try {
    const res = await fetch(`/api/acceptors/detail/${id}`, {
      credentials: 'same-origin',
    });
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
