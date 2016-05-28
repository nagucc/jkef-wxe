import { combineReducers } from 'redux';
import runtime from './runtime';
import listAcceptors from './listAcceptors';
import me from './wxe-auth';

export default combineReducers({
  runtime,
  listAcceptors,
  me,
});
