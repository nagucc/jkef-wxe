import { combineReducers } from 'redux';
import { SET_IDCARD_TYPE_PERSON,
  SET_IDCARD_TYPE_GROUP,
  USER_IS_MANAGER, USER_IS_MEMBER } from '../../constants';

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

const cardPanel = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case USER_IS_MANAGER :
    case USER_IS_MEMBER :
      return { ...state, visiable: true };
    default:
      return state;
  }
};

const wxePanel = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case USER_IS_MANAGER:
      return { ...state, visiable: true };
    default:
      return state;
  }
};

export default combineReducers({
  ui: combineReducers({
    isMale,
    baseInfoPanel,
    submitButton,
    cardPanel,
    wxePanel,
  }),
});
