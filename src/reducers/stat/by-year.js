import { combineReducers } from 'redux';
import { STAT_BY_YEAR } from '../../constants';

const data = (state = [], action) => {
  switch (action.type) {
    case STAT_BY_YEAR:
      return action.data;
    default:
      return state;
  }
};

export default combineReducers({
  data,
});
