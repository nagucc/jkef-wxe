import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { sexChange, styleChange, submitForm } from './actions';
import {
  Button, ButtonArea, Form, FormCell, Select, Toast,
  CellHeader, CellBody, Label, CellsTitle, Input,
} from 'react-weui';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSex = this.handleChangeSex.bind(this);
    this.handleChangeStyle = this.handleChangeStyle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeSex(e) {
    this.props.dispatch(sexChange(e.target.value));
  }
  handleChangeStyle(e) {
    this.props.dispatch(styleChange(e.target.value));
  }
  // fetch handle
  handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(submitForm());
  }
  render() {
    return (
      <div>
        <Toast icon="loading"
          show={this.props.toastState.show}
        >{this.props.toastState.info}</Toast>
        <div className="hd">
          <h1 className="page_title">学生信息</h1>
        </div>
        <div className="bd">
          <form className="infoForm" role="form"
            onSubmit={this.handleSubmit}
          >
            <CellsTitle>请认真填写你的信息资料</CellsTitle>
            <Form>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[0].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="text" id={this.props.data[0].name}
                    placeholder={`请输入${this.props.data[0].content}`}
                  />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[1].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="text" id={this.props.data[1].name}
                    placeholder={`请输入${this.props.data[1].content}`}
                  />
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>性别</Label>
                <CellBody>
                  <Select onChange={this.handleChangeSex}>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </Select>
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>类别</Label>
                <CellBody>
                  <Select onChange={this.handleChangeStyle}>
                    <option value="文科">文科</option>
                    <option value="理科">理科</option>
                    <option value="艺体">艺体</option>
                  </Select>
                </CellBody>
              </FormCell>
              {
                this.props.data.map((item, i) => {
                  if (i !== 0 && i !== 1) {
                    return (
                      <FormCell key={i}>
                        <CellHeader>
                          <Label>{item.content}</Label>
                        </CellHeader>
                        <CellBody>
                          <Input required id={item.name} type="text"
                            placeholder={`请输入${item.content}`}
                          />
                        </CellBody>
                      </FormCell>
                    );
                  }
                  return null;
                })
              }
              <ButtonArea direction="vertical">
                <Button type="primary">确定</Button>
                <Button type="default">返回</Button>
              </ButtonArea>
            </Form>
          </form>
        </div>
      </div>
    );
  }
}

RegistrationForm.propTypes = {
  doneForm: PropTypes.object.isRequired,
  toastState: PropTypes.object,
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function selectState(state) {
  const { doneForm, toastState } = state;
  const data = [
    {
      content: '姓名',
      name: 'name',
    },
    {
      content: '身份证',
      name: 'id',
    },
    {
      content: '联系方式',
      name: 'tel',
    },
    {
      content: '毕业学校',
      name: 'graduation',
    },
    {
      content: '高考分数',
      name: 'grade',
    },
    {
      content: '录取学校',
      name: 'university',
    },
    {
      content: '录取专业',
      name: 'major',
    },
    {
      content: '录取层次',
      name: 'degree',
    },
  ];
  return {
    doneForm,
    toastState,
    data,
  };
}
export default connect(selectState)(RegistrationForm);
