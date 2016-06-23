/*
eslint-disable react/jsx-no-bind, react/prefer-stateless-function
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Toast, Msg, ActionSheet, Button } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import CheckRoles from '../../../components/CheckRoles';
import EduHistory from './EduHistory';
import CareerHistory from './CareerHistory';
import RecordHistory from './RecordHistory';
import BaseInfo from './BaseInfo';
import * as actions from '../../../actions/acceptors/detail';
import { setUserRole } from '../../../actions/wxe-auth';

class Detail extends React.Component {
  static propTypes = {
    acceptor: React.PropTypes.object,
    showToast: PropTypes.bool,
    error: PropTypes.object,
    isManager: PropTypes.bool,
    acceptorId: PropTypes.string,
    fetchAcceptor: PropTypes.func,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { showActionSheet: false };
  }
  componentDidMount() {
    this.context.setTitle('成员详细信息');
    const { acceptorId, fetchAcceptor } = this.props;
    fetchAcceptor(acceptorId);
  }
  showActionSheet() {
    this.setState({
      showActionSheet: true,
    });
  }
  hideActionSheet() {
    this.setState({
      showActionSheet: false,
    });
  }
  render() {
    const { acceptor, acceptor: { name, _id },
      error, showToast, isManager } = this.props;

    const actionSheetParams = {
      show: this.state.showActionSheet,
      menus: [{
        label: '基本资料',
        onClick: () => (window.location = `/acceptors/edit/${_id}`),
      }, {
        label: '教育经历',
        onClick: () => (window.location = `/acceptors/edit-edu/${_id}`),
      }, {
        label: '工作经历',
        onClick: () => (window.location = `/acceptors/edit-career/${_id}`),
      }, ...(isManager ? [{
        label: '受赠记录',
        onClick: () => (window.location = `/acceptors/edit-record/${_id}`),
      }] : []),
      ],
      actions: [{
        label: '取消',
        onClick: this.hideActionSheet.bind(this),
      }],
      onRequestClose: this.hideActionSheet.bind(this),
    };

    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">{name}</h1>
        </div>
        <div className="bd">
          <NeedSignup />
          <CheckRoles success={roles => this.props.setUserRole(roles)} />
          {
            error ? <Msg type="warn" title="发生错误" description={JSON.stringify(error.msg)} /> : (
              <div>
                <BaseInfo acceptor={acceptor} />
                {
                  acceptor.eduHistory && acceptor.eduHistory.length > 0 ? (
                    <EduHistory history={acceptor.eduHistory} />
                  ) : null
                }
                {
                  acceptor.careerHistory && acceptor.careerHistory.length > 0 ? (
                    <CareerHistory history={acceptor.careerHistory} />
                  ) : null
                }
                <RecordHistory data={acceptor.records} />
                <ActionSheet {...actionSheetParams} />
              <Button onClick={this.showActionSheet.bind(this)} >修改资料</Button>
              </div>
            )
          }
        </div>
        <Toast icon="loading" show={showToast} >加载中...</Toast>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { acceptor, error, toast } = state.acceptors.detail;
  return {
    showToast: toast.show,
    acceptor,
    error,
    isManager: state.me.roles.isManager,
  };
};
export default connect(mapStateToProps, { ...actions, setUserRole })(Detail);
