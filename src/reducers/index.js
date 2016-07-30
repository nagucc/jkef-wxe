import { combineReducers } from 'redux';
import listAcceptors from './listAcceptors';
import me from './wxe-auth';
import acceptors from './acceptors';
import { doneForm, toastState } from './ceeRegistration/ceeRegistration';
import { reducer as formReducer } from 'redux-form';
import stat from './stat';
import cee from './cee';
import { FETCH_FAILED } from '../constants';

const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_FAILED:
      return action.error;
    default:
      return null;
  }
};

export default combineReducers({
  doneForm,
  toastState,
  listAcceptors,
  me,
  acceptors,
  cee,
  form: formReducer,
  stat,
  error,
});
