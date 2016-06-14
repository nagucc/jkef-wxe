import { combineReducers } from 'redux';
import listAcceptors from './listAcceptors';
import me from './wxe-auth';
import acceptors from './acceptors';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  listAcceptors,
  me,
  acceptors,
  form: formReducer,
});
