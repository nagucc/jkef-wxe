import { combineReducers } from 'redux';
import { FETCHED_ME, ME_FETCHED_FAILED,
  USER_IS_MANAGER, USER_IS_SUPERVISOR } from '../constants';

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

const roles = (state = {
  isManager: false,
  isSupervisor: false,
}, action) => {
  switch (action.type) {
    case USER_IS_MANAGER:
      return { ...state, isManager: true };
    case USER_IS_SUPERVISOR:
      return { ...state, isSupervisor: true };
    default:
      return state;
  }
};

export default combineReducers({
  data,
  error,
  roles,
});
