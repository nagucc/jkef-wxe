import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { submitForm } from '../../actions/ceeRegistration/ceeRegistration';
import {
  Button, ButtonArea, Form, FormCell, Select, Toast,
  CellHeader, CellBody, Label, CellsTitle, Input, Icon,
} from 'react-weui';

// 定义表单各个字段key
export const fields = ['name', 'id', 'sex', 'style',
  'tel', 'graduation', 'grade', 'university', 'major', 'degree'];

// 表单字段的校验
const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填项';
  }
  if (!values.id) {
    errors.id = '必填项';
  } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(values.id)) {
    errors.id = '格式有误';
  }
  if (!values.tel) {
    errors.tel = '必填项';
  } else if (!isNaN(Number(values.age))) {
    errors.tel = '输入数字';
  }
  if (!values.university) {
    errors.university = '必填项';
  }
  return errors;
};

/*
毕业生录取信息表
姓名，身份证，联系方式，录取学校等一些基本信息
*/
class RegistrationForm extends Component {
  componentDidMount() {
    // 修改标题
    this.context.setTitle('毕业生录取信息');
  }
  render() {
    const {
      fields: { name, id, sex, style, tel, graduation, grade, university, major, degree },
      handleSubmit,
    } = this.props;

    // onSubmit的处理函数，发起一个submitForm action。
    const submit = value => this.props.dispatch(submitForm(value));

    return (
      <div>
        <Toast icon={this.props.toastState.icon}
          show={this.props.toastState.show}
        >{this.props.toastState.info}</Toast>
        <div className="hd">
          <h1 className="page_title">学生信息</h1>
        </div>
        <div className="bd">
          <form className="infoForm" role="form"
            onSubmit={handleSubmit(submit)}
          >
            <CellsTitle>请认真填写你的信息资料</CellsTitle>
            <Form>
              <FormCell>
                <CellHeader>
                  <Label>姓名</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="text" placeholder="请输入姓名" {...name} />
                </CellBody>
                {name.touched && name.error && <div>{name.error}</div>}
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>身份证</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="text" placeholder="请输入身份证" {...id} />
                </CellBody>
                {id.touched && id.error && <div>{id.error}</div>}
              </FormCell>
              <FormCell select selectPos="after">
                <Label>性别</Label>
                <CellBody>
                  <Select {...sex} value={sex.value || '男'}>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </Select>
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>类别</Label>
                <CellBody>
                  <Select {...style} value={style.value || '文科'}>
                    <option value="文科">文科</option>
                    <option value="理科">理科</option>
                    <option value="艺体">艺体</option>
                  </Select>
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>联系方式</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="number" placeholder="请输入联系方式" {...tel} />
                </CellBody>
                {tel.touched && tel.error && <div>{tel.error}</div>}
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>毕业学校</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" placeholder="请输入毕业学校" {...graduation} />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>高考分数</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" placeholder="请输入高考分数" {...grade} />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>录取学校</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="text" placeholder="请输入录取学校" {...university} />
                </CellBody>
                {university.touched && university.error && <div>{university.error}</div>}
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>录取专业</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" placeholder="请输入录取专业" {...major} />
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>录取层次</Label>
                <CellBody>
                  <Select {...degree} value={degree.value || '本科'}>
                    <option value="高中">高中</option>
                    <option value="本科">本科</option>
                    <option value="硕士研究生">硕士研究生</option>
                    <option value="博士研究生">博士研究生</option>
                  </Select>
                </CellBody>
              </FormCell>
              <ButtonArea direction="vertical">
                <Button type="primary">确定</Button>
              </ButtonArea>
            </Form>
          </form>
        </div>
      </div>
    );
  }
}

RegistrationForm.propTypes = {
  fields: PropTypes.object.isRequired,
  doneForm: PropTypes.object.isRequired,
  toastState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
RegistrationForm.contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

// 对state的值筛选，规范。
function selectState(state) {
  const { doneForm, toastState } = state;
  return {
    doneForm,
    toastState,
  };
}
export default reduxForm({
  form: 'information',
  fields,
  validate,
}, selectState)(RegistrationForm);
