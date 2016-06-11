import { combineReducers } from 'redux';
import { FETCHED_ACCEPTOR_BY_ID,
  FETCHING_ACCEPTOR_BY_ID,
  FETCH_ACCEPTOR_BY_ID_FAILED } from '../../constants';

const acceptor = (state = null, action) => {
  switch (action.type) {
    case FETCHED_ACCEPTOR_BY_ID:
      return action.acceptor;
    case FETCHING_ACCEPTOR_BY_ID:
    case FETCH_ACCEPTOR_BY_ID_FAILED:
      return null;
    default:
      return state;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case FETCHED_ACCEPTOR_BY_ID:
    case FETCHING_ACCEPTOR_BY_ID:
      return null;
    case FETCH_ACCEPTOR_BY_ID_FAILED:
      return { ...state, ...action.result };
    default:
      return state;
  }
};

export default combineReducers({
  acceptor,
  error,
});
