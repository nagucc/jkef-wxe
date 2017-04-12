/*
eslint-disable react/prefer-stateless-function
 */

import React, { PropTypes } from 'react';
import { Cell, CellBody, CellFooter, CellsTitle,
  Panel, PanelHeader,
  PanelBody, Preview, PreviewHeader, PreviewFooter, PreviewBody, PreviewItem, PreviewButton } from 'react-weui';

class BaseInfo extends React.Component {
  static propTypes = {
    acceptor: PropTypes.object.isRequired,
  };
  render() {
    const { name, phone, idCard, userid } = this.props.acceptor;
    return (
      <div>
        <CellsTitle>基本信息</CellsTitle>
        <Preview>
          <PreviewBody>
            <PreviewItem label="手机号" value={phone} />
            <PreviewItem label="证件类型" value={idCard ? idCard.type : null} />
            <PreviewItem label="证件号" value={idCard ? idCard.number : null} />
            <PreviewItem label="企业号帐号" value={userid} />
          </PreviewBody>
        </Preview>
      </div>
    );
  }
}

export default BaseInfo;
