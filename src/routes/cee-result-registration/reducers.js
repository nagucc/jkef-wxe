import { combineReducers } from 'redux';
import { SEX_CHANGE, STYLE_CHANGE, SUBMIT_FORM, TOAST_SHOW } from './actions';

function doneForm(state = {
  sex: '男',
  style: '理科',
}, action) {
  switch (action.type) {
    case SEX_CHANGE:
      return Object.assign({}, state, { sex: action.sex });
    case STYLE_CHANGE:
      return Object.assign({}, state, { style: action.style });
    case SUBMIT_FORM:
      return Object.assign({}, state, {
        name: document.getElementById('name').value,
        id: document.getElementById('id').value,
        tel: document.getElementById('tel').value,
        graduation: document.getElementById('graduation').value,
        grade: document.getElementById('grade').value,
        university: document.getElementById('university').value,
        major: document.getElementById('major').value,
        degree: document.getElementById('degree').value,
      });
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
  doneForm,
  toastState,
});

export default rootReducer;
