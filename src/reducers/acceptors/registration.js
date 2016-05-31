import { combineReducers } from 'redux';
import { SET_IDCARD_TYPE_PERSON,
  SET_IDCARD_TYPE_GROUP } from '../../constants';

const isMale = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case SET_IDCARD_TYPE_PERSON:
      return Object.assign({}, state, {
        visiable: true,
      });
    case SET_IDCARD_TYPE_GROUP:
      return { ...state, visiable: false };
    default:
      return state;
  }
};

const baseInfoPanel = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case SET_IDCARD_TYPE_PERSON:
    case SET_IDCARD_TYPE_GROUP:
      return { ...state, visiable: true };
    default:
      return { ...state, visiable: false };
  }
};

const submitButton = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case SET_IDCARD_TYPE_PERSON:
    case SET_IDCARD_TYPE_GROUP:
      return { ...state, visiable: true };
    default:
      return { ...state, visiable: false };
  }
};

export default combineReducers({
  ui: combineReducers({
    isMale,
    baseInfoPanel,
    submitButton,
  }),
});
