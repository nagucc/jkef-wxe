import React, { PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { OBJECT_IS_NOT_FOUND } from 'nagu-validates';

class MustHaveProfile extends React.Component {
  static propTypes = {
    success: PropTypes.func,
    fail: PropTypes.func,
    error: PropTypes.func,
  };
  static defaultProps = {
    success: emptyFunction,
    fail: () => (window.location = `/acceptors/registration?redirect_uri=${window.location.href}`),
    error: result => alert(`服务器异常：${result.msg}`), // eslint-disable-line no-alert,
  };
  async componentDidMount() {
    const { success, fail, error } = this.props;

    // 从服务器获取当前用户的Profile
    let result;
    try {
      const res = fetch('/api/profiles/me');
      result = await res.json();
    } catch (e) {
      result = { ret: 500, msg: e };
    }

    // 判断获取结果
    if (result.ret === 0) success(result.data);
    else if (result.ret === OBJECT_IS_NOT_FOUND) fail();
    else error(result);
  }
  render() {
    return null;
  }
}

export default MustHaveProfile;
