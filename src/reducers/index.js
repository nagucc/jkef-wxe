import { combineReducers } from 'redux';
import listAcceptors from './listAcceptors';
import me from './wxe-auth';
import acceptors from './acceptors';
import { reducer as formReducer } from 'redux-form';
import stat from './stat';

export default combineReducers({
  listAcceptors,
  me,
  acceptors,
  form: formReducer,
  stat,
});
