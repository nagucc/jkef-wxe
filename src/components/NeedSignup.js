import React from 'react';
import { getMe } from '../routes/fetch-data';
import emptyFunction from 'fbjs/lib/emptyFunction';

class NeedSignup extends React.Component {
  componentDidMount() {
    getMe().then(emptyFunction, result => {
      if (result.ret === -1) {
        window.location = `/api/wxe-auth?redirect_uri=${window.location.href}`;
      } else {
        alert(`服务器异常：${result.msg}`); // eslint-disable-line no-alert
      }
    });
  }
  render() {
    return null;
  }
}

export default NeedSignup;
