import { combineReducers } from 'redux';
import { FETCHED_ACCEPTORS_LIST,
  CLEAN_ACCEPTORS_LIST,
  FETCH_FAILED } from '../constants';

const data = (state = [], action) => {
  switch (action.type) {
    case FETCHED_ACCEPTORS_LIST:
      return state.concat(action.data);
    case CLEAN_ACCEPTORS_LIST:
      return [];
    default:
      return state;
  }
};

const totalCount = (state = 0, action) => {
  switch (action.type) {
    case FETCHED_ACCEPTORS_LIST:
      return action.totalCount;
    default:
      return 0;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_FAILED:
      return action.error;
    default:
      return state;
  }
};

export default combineReducers({
  data,
  totalCount,
  error,
});
