import { FETCHED_ACCEPTORS_LIST } from '../../constants';
import { findAcceptors } from '../../routes/fetch-data';
import { fetching, fetchFailed, fetchDone } from '../common';

const fetchedAcceptors = results => ({
  type: FETCHED_ACCEPTORS_LIST,
  ...results,
});
export const fetchAcceptors = params => async (dispatch) => {
  dispatch(fetching());
  try {
    const data = await findAcceptors(params);
    dispatch(fetchDone(data));
    dispatch(fetchedAcceptors(data));
  } catch (e) {
    dispatch(fetchFailed(e));
  }
};
