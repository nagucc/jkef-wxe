/*
eslint-disable react/prop-types
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CellsTitle, CellHeader, CellBody,
  Form, FormCell, Input, Select, Button, Msg } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import CheckRoles from '../../../components/CheckRoles';

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
  // static defaultProps = {
  //   acceptor: {
  //     idCard: {},
  //     name: 'xxx',
  //   },
  // };
  // componentWillReceiveProps(nextProps) {
  //   // console.log(nextProps.acceptor)
  //   // this.setState(nextProps.acceptor);
  // }
  async componentDidMount() {

    // console.log(this.props.acceptor)
    const { error, dispatch, unauthorized } = this.props;

    let acceptor = this.props.acceptor;
    if (this.props.fetchById) {
      // this.props.fetchById().then(data => {
      //   // this.setState(data);
      //   dispatch(this.props.showRegistration(data));
      // }, result => {
      //
      // })
      acceptor = await this.props.fetchById();
      this.setState(acceptor);
      dispatch(this.props.showRegistration(acceptor));
    }

    if (error) {
      dispatch(unauthorized());
      return;
    }
    // console.log(this.props.acceptor.idCard)
    // this.setState(this.props.acceptor);
    // if (this.props.error) return;
    // console.log('dispathcEvnet.........', this.props.acceptor)
    // const event = new MouseEvent('change', {
    //   view: window,
    //   bubbles: true,
    // });
    // document.getElementById('idCardType').dispatchEvent(event);
    document.getElementById('idCardType').value = acceptor.idCard.type;
    this.setState({
      idCard: {
        type: acceptor.idCard.type,
        number: this.state.idCard.number,
      },
    });
    switch (acceptor.idCard.type) {
      case '组织机构代码证':
        dispatch(this.props.setIdCardTypeGroup());
        break;
      case '身份证':
        dispatch(this.props.setIdCardTypePerson());
        break;
      default:
        dispatch(this.props.howRegistration());
    }
  }
  render() {
    const { ui, dispatch, setUserRole, acceptor, error } = this.props;
    // console.log('render..................', acceptor, this.state)

    // 处理证件类型改变时的事件
    const typeChanged = e => {
      // console.log(this.state.idCard.number)
      this.setState({
        idCard: {
          type: e.target.value,
          number: this.state.idCard.number,
        },
      });
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
      // const { isManager } = this.props.me.roles;
      // const regPerson = ui.isMale.visiable;
      const { action } = this.props;

      // // 设置userid的值
      // let userid = '';
      // if (isManager) userid = document.getElementById('userid').value;
      //
      // // 设置isMale的值
      // let isMale = '';
      // if (regPerson) isMale = document.getElementById('isMale').value;
      //
      // // 准备好需要PUT的所有数据
      // const data = {
      //   userid,
      //   name: document.getElementById('name').value,
      //   phone: document.getElementById('phone').value,
      //   isMale,
      //   idCard: {
      //     type: document.getElementById('idCardType').value,
      //     number: document.getElementById('idCardNumber').value,
      //   },
      // };
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
                      id="idCardType"
                      onChange={typeChanged}
                      defaultValue={acceptor.idCard.type}
                    />
                  </CellBody>
                </FormCell>
                <FormCell>
                  <CellHeader>证件号码</CellHeader>
                  <CellBody>
                    <Input
                      placeholder="请输入证件号码" id="idCardNumber"
                      type="text"
                      value={this.state.idCard.number}
                      onChange={e => this.setState({
                        idCard: {
                          type: this.state.idCard.type,
                          number: e.target.value,
                        },
                      })}
                    />
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
                    <Input placeholder="企业号帐号" id="userid"
                      value={this.state.userid}
                      onChange={e => this.setState({ userid: e.target.value })}
                    />
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
                    <Input placeholder="姓名或组织名称" id="name"
                      value={this.state.name}
                      onChange={e => this.setState({ name: e.target.value })}
                    />
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
                          value={this.state.isMale}
                          onChange={e => this.setState({ isMale: e.target.value })}
                        />
                      </CellBody>
                    </FormCell>
                  ) : null
                }
                <FormCell>
                  <CellHeader>手机号码</CellHeader>
                  <CellBody>
                    <Input placeholder="请输入手机号码" id="phone"
                      value={this.state.phone}
                      onChange={e => this.setState({ phone: e.target.value })}
                    />
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
  // console.log('connnect...........', state.acceptors.registration.data)
  // console.log(state.acceptors.registration.ui);
  return {
    ...state.acceptors.registration,
    me: state.me,
    acceptor: state.acceptors.registration.data,
  };
};
export default connect(mapStateToProps)(RegistrationComponent);
