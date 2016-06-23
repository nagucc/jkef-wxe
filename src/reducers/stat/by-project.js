import { combineReducers } from 'redux';
import { STAT_BY_PROJECT, FETCHING } from '../../constants';

const data = (state = [], action) => {
  switch (action.type) {
    case STAT_BY_PROJECT:
      return action.data;
    default:
      return state;
  }
};

const showToast = (state = false, action) => {
  switch (action.type) {
    case FETCHING:
      return true;
    case STAT_BY_PROJECT:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  data,
  showToast,
});
