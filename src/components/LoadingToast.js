/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Toast } from 'react-weui';

class LoadingToast extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
  };
  render() {
    const { show } = this.props;
    return <Toast icon="loading" show={show} >加载中...</Toast>;
  }
}

export default LoadingToast;
