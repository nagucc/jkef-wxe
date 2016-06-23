import { combineReducers } from 'redux';
import { ADDED_ACCEPTOR_EDU,
  DELETED_ACCEPTOR_EDU,
  INIT_ACCEPTOR_EDU_HISTORY,
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
    case INIT_ACCEPTOR_EDU_HISTORY:
      return action.eduHistory;
    case ADDED_ACCEPTOR_EDU:
      return [...state, action.edu];
    case DELETED_ACCEPTOR_EDU:
      return state.filter(({ name, year }) =>
        name !== action.edu.name || year !== action.edu.year);
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
    case ADDED_ACCEPTOR_EDU:
    case DELETED_ACCEPTOR_EDU:
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
