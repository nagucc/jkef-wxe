import { FETCHING_ACCEPTORS_LIST,
  FETCHED_ACCEPTORS_LIST,
  FETCH_FAILED,
  CLEAN_ACCEPTORS_LIST } from '../../constants';
import { findAcceptors } from '../../routes/fetch-data';
import { fetching, fetchFailed, reset } from '../common';

// const fetchingAcceptors = () => ({
//   type: FETCHING_ACCEPTORS_LIST,
// });

const fetchedAcceptors = results => ({
  type: FETCHED_ACCEPTORS_LIST,
  ...results,
});

// const fetchFailed = err => ({
//   type: FETCH_FAILED,
//   err,
// });

export const fetchAcceptors = (params) => async dispatch => {
  dispatch(fetching());
  try {
    const data = await findAcceptors(params);
    dispatch(fetchedAcceptors(data));
  } catch (e) {
    dispatch(fetchFailed(e));
  }
};
// export const cleanAcceptors = () => ({
//   type: CLEAN_ACCEPTORS_LIST,
// });
