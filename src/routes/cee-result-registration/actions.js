import fetch from '../../core/fetch';

export const SUBMIT_FORM = 'SUBMIT_FORM';
export const TOAST_SHOW = 'TOAST_SHOW';

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
      if (data1.ret === 1) {
        dispatch(toastShow({ show: true, info: data1.info }));
        setTimeout(() => {
          dispatch(toastShow({ show: false }));
        }, 3500);
      } else {
        dispatch(toastShow({ show: true, info: data1.info, icon: 'loading' }));
        setTimeout(() => {
          dispatch(toastShow({ show: false }));
        }, 3500);
      }
    }).catch((error) => {
      dispatch(toastShow({ show: true, info: error.info, icon: 'loading' }));
      setTimeout(() => {
        dispatch(toastShow({ show: false }));
      }, 3500);
    });
}

function getInput(value) {
  return {
    type: SUBMIT_FORM,
    value,
  };
}

export function submitForm(value) {
  console.log(value);
  return (dispatch, getState) => {
    dispatch(getInput(value));
    fetchState(getState(), dispatch);
  };
}
