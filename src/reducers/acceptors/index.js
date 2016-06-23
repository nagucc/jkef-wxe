import { combineReducers } from 'redux';
import registration from './registration';
import detail from './detail';
import eduHistory from './edu';
import careerHistory from './career';
import records from './record';
import list from './list';

export default combineReducers({
  registration,
  detail,
  eduHistory,
  careerHistory,
  records,
  list,
});
