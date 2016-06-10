import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Cell, CellBody, CellFooter, Toast, Msg, Icon,
  Panel, PanelHeader, PanelBody, PanelFooter } from 'react-weui';
// import NeedSignup from '../../../components/NeedSignup';
// import CheckRoles from '../../../components/CheckRoles';

class Detail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    acceptor: React.PropTypes.object,
    showToast: PropTypes.bool,
    error: PropTypes.object,
  };
  render() {
    const { acceptor, error, showToast } = this.props;
    const { name, phone, idCard, userid, _id } = acceptor;
    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">{name}</h1>
        </div>
        <div className="bd">
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
                      <CellFooter>{idCard ? idCard.number: null}</CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>企业号帐号</CellBody>
                      <CellFooter>{userid}</CellFooter>
                    </Cell>
                  </PanelBody>
                  <PanelFooter>
                    <a href={`/acceptors/edit/${_id}`}>修改基本资料</a>
                  </PanelFooter>
                </Panel>
                {/*<Panel access>
                  <PanelHeader>教育经历</PanelHeader>
                  <PanelBody>
                    <Cell>
                      <CellBody>玉溪一中</CellBody>
                      <CellFooter>
                        1998年入学
                        <Icon value="clear" style={{ 'padding-left': '5px' }} />
                      </CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>云南大学</CellBody>
                      <CellFooter>
                        2001年入学
                        <Icon value="clear" style={{ 'padding-left': '5px' }} />
                      </CellFooter>
                    </Cell>
                    <Cell>
                      <CellBody>云南大学</CellBody>
                      <CellFooter>2005年入学</CellFooter>
                    </Cell>
                  </PanelBody>
                  <PanelFooter>
                    <a href="#">添加教育经历</a>
                  </PanelFooter>
                </Panel>
                <Panel>
                  <PanelHeader>工作经历</PanelHeader>
                </Panel>
                <Panel>
                  <PanelHeader>受赠记录</PanelHeader>
                </Panel>*/}
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
  };
};

export default connect(mapStateToProps)(Detail);
