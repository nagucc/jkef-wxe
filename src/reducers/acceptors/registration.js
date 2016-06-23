import { combineReducers } from 'redux';
import { SET_IDCARD_TYPE_PERSON,
  SET_IDCARD_TYPE_GROUP,
  USER_IS_MANAGER, USER_IS_MEMBER,
  FETCHED_ACCEPTOR_BY_ID,
  UNAUTHORIZED,
  SHOW_ACCEPTORS_REGISTRATION } from '../../constants';

/*
性别显示组件的状态
 */
const isMale = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case SET_IDCARD_TYPE_PERSON:
      return { ...state, visiable: true };
    case SET_IDCARD_TYPE_GROUP:
      return { ...state, visiable: false };
    case FETCHED_ACCEPTOR_BY_ID: {
      const { type } = action.acceptor.idCard || {};
      if (type !== '组织机构代码证') return { ...state, visiable: true };
      return { ...state, visiable: false };
    }
    default:
      return state;
  }
};

/*
基本信息面板的状态
 */
const baseInfoPanel = (state = {
  visiable: false,
}, action) => {
  switch (action.type) {
    case SET_IDCARD_TYPE_PERSON:
    case SET_IDCARD_TYPE_GROUP:
    case FETCHED_ACCEPTOR_BY_ID:
      return { ...state, visiable: true };
    default:
      return state;
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
      return state;
  }
};

const cardPanel = (state = {
  visiable: true,
}, action) => {
  switch (action.type) {
    case UNAUTHORIZED:
      return { ...state, visiable: false };
    default:
      return { ...state, visiable: true };
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

const errorMsg = (state = {
  visiable: false,
  msg: null,
}, action) => {
  // console.log(action.type)
  switch (action.type) {
    case UNAUTHORIZED:
      return { ...state, visiable: true, msg: '无权限' };
    default:
      return { ...state, visiable: false };
  }
};

const data = (state = {
  idCard: {},
}, action) => {
  switch (action.type) {
    case SHOW_ACCEPTORS_REGISTRATION:
      return action.acceptor || { idCard: {} };
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
    errorMsg,
  }),
  data,
});
