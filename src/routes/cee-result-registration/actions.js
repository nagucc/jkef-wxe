import fetch from '../../core/fetch';

export const SEX_CHANGE = 'SEX_CHANGE';
export const STYLE_CHANGE = 'STYLE_CHANGE';
export const SUBMIT_FORM = 'SUBMIT_FORM';
export const TOAST_SHOW = 'TOAST_SHOW';

export function sexChange(sex) {
  return {
    type: SEX_CHANGE,
    sex,
  };
}

export function styleChange(style) {
  return {
    type: STYLE_CHANGE,
    style,
  };
}

function toastShow(toast) {
  return {
    type: TOAST_SHOW,
    show: toast.show,
    info: toast.info,
    icon: toast.icon,
  };
}

function checkStatus(response) {
  console.log(response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  console.log(response);
  return response.json();
}

function checkState(state, dispatch) {
  const data = state.doneForm;
  const regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!regId.test(data.id)) {
    dispatch(toastShow({ show: true, info: '身份证格式错误', icon: 'warn' }));
    setTimeout(() => {
      dispatch(toastShow({ show: false }));
    }, 3000);
  } else if (data.grade > 800 || data.grade < 100) {
    dispatch(toastShow({ show: true, info: '请核对你的分数', icon: 'warn' }));
    setTimeout(() => {
      dispatch(toastShow({ show: false }));
    }, 3000);
  } else {
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
        console.log('sakdjfljasdjf',data1);
        if (data1.ret === 1) {
          dispatch(toastShow({ show: true, info: data1.info }));
          setTimeout(() => {
            dispatch(toastShow({ show: false }));
          }, 3000);
        } else {
          dispatch(toastShow({ show: true, info: data1.info, icon: 'warn' }));
          setTimeout(() => {
            dispatch(toastShow({ show: false }));
          }, 3000);
        }
      }).catch((error) => {
        dispatch(toastShow({ show: true, info: error.info, icon: 'warn' }));
        setTimeout(() => {
          dispatch(toastShow({ show: false }));
        }, 3000);
      });
  }
}

function getInput() {
  return {
    type: SUBMIT_FORM,
  };
}

export function submitForm() {
  return (dispatch, getState) => {
    dispatch(getInput());
    checkState(getState(), dispatch);
  };
}
