import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import user from './user';
import runtime from './runtime';
import wechat from './wechat';
import stat from './stat';
export default combineReducers({
  form,
  wechat,
  user,
  runtime,
  stat,
});
