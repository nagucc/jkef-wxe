import { combineReducers } from 'redux';
import { SHOW_ACCEPTORS_REGISTRATION,
  SET_IDCARD_TYPE_PERSON,
  SET_IDCARD_TYPE_GROUP } from '../../constants';

const ui = {
  isMale: (state = {
    visiable: false,
  }, action) => {
    switch (action.type) {
      case SET_IDCARD_TYPE_PERSON:
        return Object.assign({}, state, {
          visiable: true,
        });
      default:
        return state;
    }
  },
};

export default combineReducers({
  ui,
});
