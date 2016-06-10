/*
eslint-disable react/prop-types
 */
import React, { PropTypes } from 'react';
import { CellsTitle, CellHeader, CellBody,
  Form, FormCell, Input, Select, Button, Msg } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import CheckRoles from '../../../components/CheckRoles';
import { reduxForm } from 'redux-form'

/*
受赠者登记表
包括：姓名、证件信息、性别、手机号
 */
export class RegistrationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.acceptor;
    // console.log('constructor....', this.state)
  }
  static propTypes = {
    dispatch: PropTypes.func,
    setIdCardTypeGroup: PropTypes.func,
    setIdCardTypePerson: PropTypes.func,
    showRegistration: PropTypes.func,
    setUserRole: PropTypes.func,
    action: PropTypes.func.isRequired,
    ui: PropTypes.object,
    me: PropTypes.object,
  };
  async componentDidMount() {

    const { error, dispatch, unauthorized } = this.props;

    let acceptor = this.props.acceptor;
    if (this.props.fetchById) {
      acceptor = await this.props.fetchById();
      dispatch(this.props.showRegistration(acceptor));
    }

    if (error) {
      dispatch(unauthorized());
      return;
    }
    const event = new MouseEvent('change', {
      view: window,
      bubbles: true,
    });
    document.getElementById('idCardType').dispatchEvent(event);
  }
  render() {
    const { ui, dispatch, setUserRole, acceptor, error, fields } = this.props;

    // 处理证件类型改变时的事件
    const typeChanged = e => {
      fields.idCard.type.onChange(e);
      const { setIdCardTypeGroup, setIdCardTypePerson, showRegistration } = this.props;
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
    };
    // 处理提交按钮的点击事件
    const submit = () => {
      const { action } = this.props;
      action(this.state).then(acc => {
        window.location = `/acceptors/detail/${acc._id}`;
      }, result => {
        alert(`操作失败：${JSON.stringify(result.msg)}`); // eslint-disable-line no-alert
      });
    };
    // 返回组件
    return (
      <div className="progress">
        <NeedSignup />
        <CheckRoles success={roles => dispatch(setUserRole(roles))} />
        <div className="hd">
          <h1 className="page_title">{acceptor.name || '受赠者登记'}</h1>
        </div>
        <div className="bd">
          {
            // ui.errorMsg.visiable ? (
            //   <Msg type="warn" title="发生错误" description={ui.errorMsg.msg} />
            //   ) : null
          }
          {
            ui.cardPanel.visiable ? (
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
            ui.submitButton.visiable ? (
              <Button onClick={submit} >确定</Button>
            ) : null
          }
          <Button onClick={() => console.log(this.state)} >test</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.acceptors.registration,
    me: state.me,
    acceptor: state.acceptors.registration.data,
    initialValues: state.acceptors.registration.data,
  };
};
export default reduxForm({
  form: 'registration',
  fields: ['userid', 'idCard.number', 'idCard.type', 'name', 'phone', 'isMale'],
}, mapStateToProps)(RegistrationComponent);
