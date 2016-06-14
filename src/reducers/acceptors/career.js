import { combineReducers } from 'redux';
import { ADDED_ACCEPTOR_CAREER,
  DELETED_ACCEPTOR_CAREER,
  INIT_ACCEPTOR_CAREER_HISTORY,
  FETCH_FAILED, FETCHING } from '../../constants';

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
    case INIT_ACCEPTOR_CAREER_HISTORY:
      return action.careerHistory;
    case ADDED_ACCEPTOR_CAREER:
      return [...state, action.career];
    case DELETED_ACCEPTOR_CAREER:
      return state.filter(({ name, year }) =>
        name !== action.career.name || year !== action.career.year);
    default:
      return state;
  }
};

const toast = (state = {
  show: false,
}, action) => {
  switch (action.type) {
    case FETCHING:
      return {
        show: true,
        text: '请稍候',
        icon: 'loading',
      };
    case ADDED_ACCEPTOR_CAREER:
    case DELETED_ACCEPTOR_CAREER:
      return {
        show: true,
        text: '操作成功',
        icon: 'toast',
      };
    default:
      return {
        show: false,
      };
  }
};

export default combineReducers({
  data,
  error,
  toast,
});
