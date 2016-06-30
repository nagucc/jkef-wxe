import { SUBMIT_FORM, TOAST_SHOW } from '../../constants';

import fetch from '../../core/fetch';

// 提交toast组件的action creator
function toastShow(toast) {
  return {
    type: TOAST_SHOW,
    show: toast.show,
    info: toast.info,
    icon: toast.icon,
  };
}

// 检查fetch后的状态。
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

// 处理fetch后的res数据格式。
function parseJSON(response) {
  return response.json();
}

// post数据，并为不同的返回结果作出不同的响应。
function fetchState(state, dispatch) {
  const data = state.doneForm;
  fetch('/api/fundinfo', {
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((data1) => {
      // 成功post
      if (data1.ret === 1) {
        dispatch(toastShow({ show: true, info: data1.info }));
        // 恢复toast原先的状态
        setTimeout(() => {
          dispatch(toastShow({ show: false }));
        }, 3500);
      } else {
        // 重复post同一个id
        dispatch(toastShow({ show: true, info: data1.info, icon: 'loading' }));
        setTimeout(() => {
          dispatch(toastShow({ show: false }));
        }, 3500);
      }
    }).catch((error) => {
      // 数据库出错
      dispatch(toastShow({ show: true, info: error.info, icon: 'loading' }));
      setTimeout(() => {
        dispatch(toastShow({ show: false }));
      }, 3500);
    });
}

// 发起submit_form action，对doneForm进行更新
function getInput(value) {
  return {
    type: SUBMIT_FORM,
    value,
  };
}

// thunk，value来自提交的redux-form，select存在问题，需要getInput优化state。
export function submitForm(value) {
  return (dispatch, getState) => {
    dispatch(getInput(value));
    fetchState(getState(), dispatch);
  };
}
