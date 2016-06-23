import { combineReducers } from 'redux';
import { STAT_BY_PROJECT } from '../../constants';

const data = (state = [], action) => {
  switch (action.type) {
    case STAT_BY_PROJECT:
      return action.data;
    default:
      return state;
  }
};

export default combineReducers({
  data,
});
