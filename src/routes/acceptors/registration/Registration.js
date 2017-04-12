/*
eslint-disable react/prop-types
 */
import React, { PropTypes } from 'react';
import { CellsTitle, CellHeader, CellBody,
  Form, FormCell, Input, Select, Button, Msg, Toast } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import CheckRoles from '../../../components/CheckRoles';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import Container from '../../../components/Weui/Container';
import Footer from '../../../components/Footer';
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
  async componentDidMount() {
    // 设置标题
    const { error, fetchById, showRegistration, unauthorized } = this.props;

    if (fetchById) showRegistration(await fetchById());

    if (error) {
      unauthorized();
      return;
    }
    const event = new MouseEvent('change', {
      view: window,
      bubbles: true,
    });
    // document.getElementById('idCardType').dispatchEvent(event);
  }
  render() {
    const { ui, setUserRole, fields, action, title, defaultTitle, toast, values } = this.props;

    // 处理证件类型改变时的事件
    const typeChanged = (e) => {
      // fields.idCard.type.onChange(e);
      const { setIdCardTypeGroup, setIdCardTypePerson } = this.props;
      switch (e.target.value) {
        case '统一社会信用代码证':
          setIdCardTypeGroup();
          break;
        case '身份证':
          setIdCardTypePerson();
          break;
        default:
      }
    };

    // 处理提交按钮的点击事件
    const submit = values => action(values).then((acc) => {
      window.location = `/acceptors/detail/${acc._id}`;
    }, (result) => {
      alert(`操作失败：${JSON.stringify(result)}`); // eslint-disable-line no-alert
    });

    // 返回组件
    return (
      <Container>
        <div className="page__hd" >
          <h1 className="page_title">{title || defaultTitle || '纳谷社区'}</h1>
        </div>
        <div className="page__bd">
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
                    <Field
                      name="idCard.type" component="select"
                      className="weui-select"
                      onChange={typeChanged}
                    >
                      <option value="">请选择证件类型</option>
                      <option value="身份证">身份证</option>
                      <option value="统一社会信用代码证">统一社会信用代码证</option>
                    </Field>
                  </CellBody>
                </FormCell>
                <FormCell>
                  <CellHeader>证件号码</CellHeader>
                  <CellBody>
                    <Field name="idCard.number" component="input" placeholder="请输入证件号码" className="weui-input" />
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
                    <Field component="input" name="userid" className="weui-input" placeholder="企业号帐号" />
                  </CellBody>
                </FormCell>
              </Form>
            ) : null
          }
          <Form>
            <CellsTitle>基本信息</CellsTitle>
            <FormCell>
              <CellHeader>名称</CellHeader>
              <CellBody>
                <Field component="input" name="name" className="weui-input" placeholder="姓名或组织名称" />
              </CellBody>
            </FormCell>
            {
              values.idCard && values.idCard.type === '身份证' ? (
                <FormCell select>
                  <CellBody>
                    <Field component="select" name="isMale" className="weui-select">
                      <option value="">请选择性别</option>
                      <option value>男</option>
                      <option value={false}>女</option>
                    </Field>
                  </CellBody>
                </FormCell>
              ) : null
            }
            <FormCell>
              <CellHeader>手机号码</CellHeader>
              <CellBody>
                <Field component="input" name="phone" className="weui-input" placeholder="请输入手机号码" />
              </CellBody>
            </FormCell>
          </Form>
          <Button onClick={this.props.handleSubmit(submit)} >确定</Button>
        </div>
        <Footer />
        <Toast show={toast.loading} icon="loading">加载中</Toast>
      </Container>
    );
  }
}

const selector = formValueSelector('registration');
const mapStateToProps = state => ({
  ...state.acceptors.registration,
  ...state.wechat,
  values: selector(state, 'name', 'idCard'),
  me: state.me,
  title: state.acceptors.registration.data.name,
  // initialValues: state.acceptors.registration.data,
});
export default reduxForm({
  form: 'registration',
  // fields: ['userid', 'idCard.number', 'idCard.type', 'name', 'phone', 'isMale'],
})(connect(mapStateToProps, {
  ...registrationActions,
  ...authActions,
})(RegistrationComponent));
