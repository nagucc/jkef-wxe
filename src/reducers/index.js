import { combineReducers } from 'redux';
import listAcceptors from './listAcceptors';
import me from './wxe-auth';
import acceptors from './acceptors';
import { reducer as formReducer } from 'redux-form';
import stat from './stat';
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
  listAcceptors,
  me,
  acceptors,
  form: formReducer,
  stat,
  error,
});
