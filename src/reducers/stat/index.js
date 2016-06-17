import { combineReducers } from 'redux';
import byYear from './by-year';
import byProject from './by-project';

export default combineReducers({
  byYear,
  byProject,
});
