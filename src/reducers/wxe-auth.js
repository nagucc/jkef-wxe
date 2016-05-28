import { combineReducers } from 'redux';
import { FETCHED_ME, ME_FETCHED_FAILED } from '../constants';

const data = (state = {}, action) => {
  switch (action.type) {
    case FETCHED_ME:
      return action.me;
    default:
      return state;
  }
};

const error = (state = '', action) => {
  switch (action.type) {
    case ME_FETCHED_FAILED:
      return action.err;
    default:
      return state;
  }
};

export default combineReducers({
  data,
  error,
});
