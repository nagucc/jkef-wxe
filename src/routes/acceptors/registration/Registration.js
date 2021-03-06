/*
eslint-disable react/prop-types
 */
import React, { PropTypes } from 'react';
import { CellsTitle, CellHeader, CellBody,
  Form, FormCell, Input, Select, Button, Msg } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import CheckRoles from '../../../components/CheckRoles';
import { reduxForm } from 'redux-form';
import * as registrationActions from '../../../actions/acceptors/registration';
import * as authActions from '../../../actions/wxe-auth';

/*
受赠者登记表
包括：姓名、证件信息、性别、手机号
 */
export class RegistrationComponent extends React.Component {
  static propTypes = {
    setIdCardTypeGroup: PropTypes.func.isRequired,
    setIdCardTypePerson: PropTypes.func.isRequired,
    showRegistration: PropTypes.func.isRequired,
    setUserRole: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    me: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  async componentDidMount() {
    // 设置标题
    this.context.setTitle('填写成员信息');
    const { error, fetchById, showRegistration, unauthorized } = this.props;

    if (this.props.fetchById) showRegistration(await fetchById());

    if (error) {
      unauthorized();
      return;
    }
    const event = new MouseEvent('change', {
      view: window,
      bubbles: true,
    });
    document.getElementById('idCardType').dispatchEvent(event);
  }
  render() {
    const { ui, setUserRole, fields, action } = this.props;

    // 处理证件类型改变时的事件
    const typeChanged = e => {
      fields.idCard.type.onChange(e);
      const { setIdCardTypeGroup, setIdCardTypePerson } = this.props;
      switch (e.target.value) {
        case '组织机构代码证':
          setIdCardTypeGroup();
          break;
        case '身份证':
          setIdCardTypePerson();
          break;
        default:
      }
    };
    // 处理提交按钮的点击事件
    const submit = values => action(values).then(acc => {
      window.location = `/acceptors/detail/${acc._id}`;
    }, result => {
      alert(`操作失败：${JSON.stringify(result)}`); // eslint-disable-line no-alert
    });
    // 返回组件
    return (
      <div className="progress">
        <NeedSignup />
        <CheckRoles success={roles => setUserRole(roles)} />
        <div className="hd">
          <h1 className="page_title">{this.props.title || '纳谷社区'}</h1>
        </div>
        <div className="bd">
          {
            ui.errorMsg.visiable ? (
              <Msg type="warn" title="发生错误" description={ui.errorMsg.msg} />
              ) : null
          }
          {
            ui.cardPanel.visiable ? (
              <Form>
                <CellsTitle>证件信息</CellsTitle>
                <FormCell select>
                  <CellBody>
                    <Select data={[{
                      value: '',
                      label: '请选择证件类型',
                    }, {
                      value: '身份证',
                      label: '身份证',
                    }, {
                      value: '组织机构代码证',
                      label: '组织机构代码证',
                    }]}
                      {...fields.idCard.type}
                      onChange={typeChanged}
                      id="idCardType"
                    />
                  </CellBody>
                </FormCell>
                <FormCell>
                  <CellHeader>证件号码</CellHeader>
                  <CellBody>
                    <Input placeholder="请输入证件号码" {...fields.idCard.number} />
                  </CellBody>
                </FormCell>
              </Form>
            ) : null
          }
          {
            ui.wxePanel.visiable ? (
              <Form>
                <CellsTitle>企业号帐号绑定</CellsTitle>
                <FormCell>
                  <CellHeader>帐号</CellHeader>
                  <CellBody>
                    <Input placeholder="企业号帐号" {...fields.userid} />
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
                    <Input placeholder="姓名或组织名称" {...fields.name} />
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
                          {...fields.isMale}
                        />
                      </CellBody>
                    </FormCell>
                  ) : null
                }
                <FormCell>
                  <CellHeader>手机号码</CellHeader>
                  <CellBody>
                    <Input placeholder="请输入手机号码" {...fields.phone} />
                  </CellBody>
                </FormCell>
              </Form>
            ) : null
          }
          {
            fields.idCard.type.value ? (
              <Button onClick={this.props.handleSubmit(submit)} >确定</Button>
            ) : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.acceptors.registration,
    me: state.me,
    title: state.acceptors.registration.data.name,
    initialValues: state.acceptors.registration.data,
  };
};
export default reduxForm({
  form: 'registration',
  fields: ['userid', 'idCard.number', 'idCard.type', 'name', 'phone', 'isMale'],
}, mapStateToProps, { ...registrationActions, ...authActions })(RegistrationComponent);
