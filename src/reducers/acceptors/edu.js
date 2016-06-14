import { combineReducers } from 'redux';
import { ADDED_ACCEPTOR_EDU,
  DELETED_ACCEPTOR_EDU,
  INIT_ACCEPTOR_EDU_HISTORY,
  FETCH_FAILED } from '../../constants';

const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_FAILED:
      return action.error;
    default:
      return null;
  }
};

const data = (state = [], action) => {
  switch (action.type) {
    case INIT_ACCEPTOR_EDU_HISTORY:
      return action.eduHistory;
    case ADDED_ACCEPTOR_EDU: {
      const result = [...state, action.edu];
      result.sort((a, b) => a.year - b.year);
      return result;
    }
    case DELETED_ACCEPTOR_EDU:
      return state.filter(({ name, year }) =>
        name !== action.name && year !== action.year);
    default:
      return state;
  }
};

export default combineReducers({
  data,
  error,
});
