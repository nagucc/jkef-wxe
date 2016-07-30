import { combineReducers } from 'redux';
import { SUBMIT_FORM, TOAST_SHOW } from './actions';
import { reducer as formReducer } from 'redux-form';

function doneForm(state = {
  sex: '男',
  style: '理科',
  degree: '本科',
}, action) {
  switch (action.type) {
    case SUBMIT_FORM:
      if (action.value.sex === undefined ||
        action.value.style === undefined || action.value.degree === undefined) {
        return { ...action.value, ...state };
      }
      return { ...state, ...action.value };
    default:
      return state;
  }
}
function toastState(state = { show: false }, action) {
  switch (action.type) {
    case TOAST_SHOW:
      return Object.assign({}, state, { show: action.show, info: action.info, icon: action.icon });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  form: formReducer,
  doneForm,
  toastState,
});

export default rootReducer;
