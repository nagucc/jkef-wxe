import { combineReducers } from 'redux';
import listAcceptors from './listAcceptors';
import me from './wxe-auth';
import acceptors from './acceptors';

export default combineReducers({
  listAcceptors,
  me,
  acceptors,
});
