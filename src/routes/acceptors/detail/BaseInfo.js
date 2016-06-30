/*
eslint-disable react/prefer-stateless-function
 */

import React, { PropTypes } from 'react';
import { Cell, CellBody, CellFooter,
  Panel, PanelHeader,
  PanelBody } from 'react-weui';

class BaseInfo extends React.Component {
  static propTypes = {
    acceptor: PropTypes.object.isRequired,
  };
  render() {
    const { name, phone, idCard, userid } = this.props.acceptor;
    return (
      <Panel access>
        <PanelHeader>基本信息</PanelHeader>
        <PanelBody>
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
    );
  }
}

export default BaseInfo;
