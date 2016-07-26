import { combineReducers } from 'redux';
import { FETCHED_CEE_RESULT,
  FETCH_FAILED, FETCHING } from '../../constants';

const data = (state = [], action) => {
  switch (action.type) {
    case FETCHED_CEE_RESULT:
      return action.data;
    default:
      return state;
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

const showToast = (state = false, action) => {
  switch (action.type) {
    case FETCHING:
      return true;
    case FETCHED_CEE_RESULT:
    case FETCH_FAILED:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  data,
  error,
  showToast,
});
