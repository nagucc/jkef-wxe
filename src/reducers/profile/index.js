import { combineReducers } from 'redux';
import { FETCHED_MY_PROFILE } from '../../constants';

const me = (state = {}, action) => {
  switch (action.type) {
    case FETCHED_MY_PROFILE:
      return action.profile;
    default:
      return state;
  }
};

export default combineReducers({
  me,
});