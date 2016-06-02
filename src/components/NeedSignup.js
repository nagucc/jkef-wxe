import React, { PropTypes } from 'react';
import { getMe } from '../routes/fetch-data';
import emptyFunction from 'fbjs/lib/emptyFunction';

class NeedSignup extends React.Component {
  static propTypes = {
    success: PropTypes.func,
    fail: PropTypes.func,
    error: PropTypes.func,
  };
  static defaultProps = {
    success: emptyFunction,
    fail: () => (window.location = `/api/wxe-auth?redirect_uri=${window.location.href}`),
    error: result => alert(`服务器异常：${result.msg}`), // eslint-disable-line no-alert,
  };
  componentDidMount() {
    const { success, fail, error } = this.props;
    getMe().then(success, result => {
      if (result.ret === -1) fail(result);
      else error(result);
    });
  }
  render() {
    return null;
  }
}

export default NeedSignup;
