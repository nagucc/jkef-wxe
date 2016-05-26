import { combineReducers } from 'redux';
import runtime from './runtime';
import listAcceptors from './listAcceptors';

export default combineReducers({
  runtime,
  listAcceptors,
});
