import { combineReducers } from 'redux';
import registration from './registration';
import detail from './detail';
import eduHistory from './edu';
import careerHistory from './career';

export default combineReducers({
  registration,
  detail,
  eduHistory,
  careerHistory,
});
