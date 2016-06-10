import { FETCH_ACCEPTOR_BY_ID_FAILED,
  FETCHED_ACCEPTOR_BY_ID, FETCHING_ACCEPTOR_BY_ID } from '../../constants';
import fetch from '../../core/fetch';

const fetchFailed = result => ({
  type: FETCH_ACCEPTOR_BY_ID_FAILED,
  result,
});

const fetched = acceptor => ({
  type: FETCHED_ACCEPTOR_BY_ID,
  acceptor,
});

const fetching = () => ({
  type: FETCHING_ACCEPTOR_BY_ID,
});

export const fetchAcceptor = id => async dispatch => {
  dispatch(fetching());
  fetch(`/api/acceptors/detail/${id}`, {
    credentials: 'same-origin',
  }).then(async res => {
    const result = await res.json();
    if (result.ret === 0) dispatch(fetched(result.data));
    else dispatch(fetchFailed(result));
  }, result => dispatch(fetchFailed(result)));
};
