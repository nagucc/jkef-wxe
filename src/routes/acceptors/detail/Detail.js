/*
eslint-disable react/jsx-no-bind
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Cell, CellBody, CellFooter,
  Toast, Msg, ActionSheet, Button,
  Panel, PanelHeader,
  PanelBody } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
// import CheckRoles from '../../../components/CheckRoles';
import EduHistory from './EduHistory';
import CareerHistory from './CareerHistory';
import AcceptHistory from './AcceptHistory';

class Detail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    acceptor: React.PropTypes.object,
    showToast: PropTypes.bool,
    error: PropTypes.object,
    isManager: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = { showActionSheet: false };
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
    const { acceptor, error, showToast, isManager } = this.props;
    const { name, phone, idCard, userid, _id } = acceptor;

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
        onClick: () => (window.location = `/acceptors/edit-accept-record/${_id}`),
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
          {
            error ? <Msg type="warn" title="发生错误" description={error.msg} /> : (
              <div>
                <Panel access>
                  <PanelHeader>基本信息</PanelHeader>
                  <PanelBody>
                    <Cell>
                      <CellBody>姓名</CellBody>
                      <CellFooter>{name}</CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>手机号</CellBody>
                      <CellFooter>{phone}</CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>证件类型</CellBody>
                      <CellFooter>{idCard ? idCard.type : null}</CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>证件号</CellBody>
                      <CellFooter>{idCard ? idCard.number : null}</CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>企业号帐号</CellBody>
                      <CellFooter>{userid}</CellFooter>
                    </Cell>
                  </PanelBody>
                </Panel>
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
                <AcceptHistory history={[]} />
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
  const { acceptor, error } = state.acceptors.detail;
  return {
    showToast: acceptor === null && error === null,
    acceptor: acceptor || { idCard: {} },
    error,
    isManager: state.me.roles.isManager,
  };
};

export default connect(mapStateToProps)(Detail);
