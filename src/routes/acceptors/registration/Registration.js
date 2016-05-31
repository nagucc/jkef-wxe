import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CellsTitle, CellHeader, CellBody,
  Form, FormCell, Input, Select, Button } from 'react-weui';
/*
受赠者登记表
包括：姓名、证件信息、性别、手机号
 */
class Registration extends React.Component {
  static propTypes = {
    isManager: PropTypes.bool,
    dispatch: PropTypes.func,
    setIdCardTypeGroup: PropTypes.func,
    setIdCardTypePerson: PropTypes.func,
    showRegistration: PropTypes.func,
    ui: PropTypes.object,
  };
  typeChanged(e) {
    const { dispatch, setIdCardTypeGroup, setIdCardTypePerson, showRegistration } = this.props;
    switch (e.target.value) {
      case '组织机构代码证':
        dispatch(setIdCardTypeGroup());
        break;
      case '身份证':
        dispatch(setIdCardTypePerson());
        break;
      default:
        dispatch(showRegistration());
    }
  }
  submit() {
    // 设置userid的值
    const elemUserid = document.getElementById('userid');
    let userid = '';
    if (elemUserid) userid = elemUserid.value;
    // 准备好需要PUT的所有数据
    const data = {
      userid,
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      isMale: document.getElementById('isMale').value,
      idCard: {
        type: document.getElementById('idCardType').value,
        number: document.getElementById('idCardNumber').value,
      },
    };
    console.log(data)
  }
  render() {
    const { isManager, ui } = this.props;
    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">受赠者登记</h1>
        </div>
        <div className="bd">
          <Form>
            <CellsTitle>证件信息</CellsTitle>
            <FormCell select>
              <CellBody>
                <Select data={[{
                  value: null,
                  label: '请选择证件类型',
                }, {
                  value: '身份证',
                  label: '身份证',
                }, {
                  value: '组织机构代码证',
                  label: '组织机构代码证',
                }]}
                  id="idCardType"
                  onChange={this.typeChanged.bind(this)}
                />
              </CellBody>
            </FormCell>
            <FormCell>
              <CellHeader>证件号码</CellHeader>
              <CellBody>
                <Input placeholder="请输入证件号码" id="idCardNumber" />
              </CellBody>
            </FormCell>
            {
              isManager ? <CellsTitle>企业号帐号绑定</CellsTitle> : null
            }
            {
              isManager ? (
                <FormCell>
                  <CellHeader>帐号</CellHeader>
                  <CellBody>
                    <Input placeholder="企业号帐号" id="userid" />
                  </CellBody>
                </FormCell>
              ) : null
            }
          </Form>
          {
            ui.baseInfoPanel.visiable ? (
              <Form>
                <CellsTitle>基本信息</CellsTitle>
                <FormCell>
                  <CellHeader>名称</CellHeader>
                  <CellBody>
                    <Input placeholder="姓名或组织名称" id="name" />
                  </CellBody>
                </FormCell>
                {
                  ui.isMale.visiable ? (
                    <FormCell select>
                      <CellBody>
                        <Select data={[{
                          value: null,
                          label: '请选择性别',
                        }, {
                          value: true,
                          label: '男',
                        }, {
                          value: false,
                          label: '女',
                        }]}
                          id="isMale"
                        />
                      </CellBody>
                    </FormCell>
                  ) : null
                }
                <FormCell>
                  <CellHeader>手机号码</CellHeader>
                  <CellBody>
                    <Input placeholder="请输入手机号码" id="phone" />
                  </CellBody>
                </FormCell>
              </Form>
            ) : null
          }
          {
            ui.submitButton.visiable ? (
              <Button onClick={this.submit.bind(this)} >确定</Button>
            ) : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.acceptors.registration,
});
export default connect(mapStateToProps)(Registration);
