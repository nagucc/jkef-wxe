import React, { PropTypes } from 'react';
import { getMyRoles } from '../routes/fetch-data';
import emptyFunction from 'fbjs/lib/emptyFunction';

class CheckRoles extends React.Component {
  static propTypes = {
    isSupervisor: React.PropTypes.bool,
    isManager: PropTypes.bool,
    success: PropTypes.func,
    fail: PropTypes.func,
    error: PropTypes.func,
  };
  static defaultProps = {
    isSupervisor: false,
    isManager: false,
    success: emptyFunction,
    fail: emptyFunction,
    error: result => alert(`服务器异常：${result.msg}`), // eslint-disable-line no-alert,
  };
  componentDidMount() {
    const { success, error, fail, isSupervisor, isManager } = this.props;
    getMyRoles().then(roles => {
      let checked = true;
      if (isSupervisor && !roles.isSupervisor) checked = false;
      if (isManager && !roles.isManager) checked = false;
      if (checked) success(roles);
      else fail(roles);
    }, error);
  }
  render() {
    return null;
  }
}
export default CheckRoles;
