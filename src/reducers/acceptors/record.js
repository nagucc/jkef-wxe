import { combineReducers } from 'redux';
import { INIT_ACCEPTOR_RECORD,
  ADDED_ACCEPTOR_RECORD,
  DELETED_ACCEPTOR_RECORD,
  FETCHED_ACCEPTOR_BY_ID,
  FETCHING } from '../../constants';

const data = (state = [], action) => {
  switch (action.type) {
    case INIT_ACCEPTOR_RECORD:
      return action.records;
    case FETCHED_ACCEPTOR_BY_ID:
      return action.acceptor.records || [];
    case ADDED_ACCEPTOR_RECORD:
      return [...state, action.record];
    case DELETED_ACCEPTOR_RECORD:
      return state.filter(record =>
        action.recordId !== record._id);
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
      };
    default:
      return {
        show: false,
      };
  }
};

export default combineReducers({
  data,
  toast,
});
