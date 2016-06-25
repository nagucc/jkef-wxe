import { SUBMIT_FORM, TOAST_SHOW } from '../../constants';

// 毕业生信息表单state更新
export function doneForm(state = {
  sex: '男',
  style: '理科',
  degree: '本科',
}, action) {
  switch (action.type) {
    case SUBMIT_FORM:
      // redux-form的select字段存在问题，没有任何操作的条目value为undefined，为了避免背undefined覆盖
      // 需要分情况进行。
      if (action.value.sex === undefined ||
        action.value.style === undefined || action.value.degree === undefined) {
        return { ...action.value, ...state };
      }
      return { ...state, ...action.value };
    default:
      return state;
  }
}
// 提交toast组件的状态更新
export function toastState(state = { show: false }, action) {
  switch (action.type) {
    case TOAST_SHOW:
      return Object.assign({}, state, { show: action.show, info: action.info, icon: action.icon });
    default:
      return state;
  }
}
