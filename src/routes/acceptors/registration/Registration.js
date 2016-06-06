import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CellsTitle, CellHeader, CellBody,
  Form, FormCell, Input, Select, Button } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import CheckRoles from '../../../components/CheckRoles';

/*
受赠者登记表
包括：姓名、证件信息、性别、手机号
 */
class Registration extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    setIdCardTypeGroup: PropTypes.func,
    setIdCardTypePerson: PropTypes.func,
    showRegistration: PropTypes.func,
    setUserRole: PropTypes.func,
    register: PropTypes.func.isRequired,
    ui: PropTypes.object,
    me: PropTypes.object,
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
    const { isManager } = this.props.me.roles;
    const regPerson = this.props.ui.isMale.visiable;
    const { register } = this.props.register;

    // 设置userid的值
    let userid = '';
    if (isManager) userid = document.getElementById('userid').value;

    // 设置isMale的值
    let isMale = '';
    if (regPerson) isMale = document.getElementById('isMale').value;

    // 准备好需要PUT的所有数据
    const data = {
      userid,
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      isMale,
      idCard: {
        type: document.getElementById('idCardType').value,
        number: document.getElementById('idCardNumber').value,
      },
    };
    register(data).then(acc => {
      window.location = `/acceptors/detail/${acc._id}`;
    }, result => {
      alert(`操作失败：${result.msg}`); // eslint-disable-line no-alert
    });
  }
  render() {
    const { ui, dispatch, setUserRole } = this.props;
    return (
      <div className="progress">
        <NeedSignup success={() => dispatch(setUserRole({ signup: true }))} />
        <CheckRoles success={roles => dispatch(setUserRole(roles))} />
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
          </Form>
          {
            ui.wxePanel.visiable ? (
              <Form>
                <CellsTitle>企业号帐号绑定</CellsTitle>
                <FormCell>
                  <CellHeader>帐号</CellHeader>
                  <CellBody>
                    <Input placeholder="企业号帐号" id="userid" />
                  </CellBody>
                </FormCell>
              </Form>
            ) : null
          }
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
                          value: '',
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
  me: state.me,
});
export default connect(mapStateToProps)(Registration);
