import { combineReducers } from 'redux';
import { FETCHED_ACCEPTOR_BY_ID,
  FETCHING,
  FETCH_FAILED } from '../../constants';

const emptyAcceptor = {
  idCard: {},
  records: [],
};
const acceptor = (state = emptyAcceptor, action) => {
  switch (action.type) {
    case FETCHED_ACCEPTOR_BY_ID:
      return action.acceptor;
    default:
      return state;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case FETCHED_ACCEPTOR_BY_ID:
    case FETCHING:
      return null;
    case FETCH_FAILED:
      return { ...state, ...action.error };
    default:
      return state;
  }
};

const toast = (state = {
  show: false,
}, action) => {
  switch (action.type) {
    case FETCHING:
      return { show: true };
    case FETCH_FAILED:
    case FETCHED_ACCEPTOR_BY_ID:
      return { show: false };
    default:
      return state;
  }
};

export default combineReducers({
  acceptor,
  error,
  toast,
});
