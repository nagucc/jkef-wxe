/*
添加用户的教育经历
 */
/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Form, FormCell, Icon,
  CellHeader, CellBody, CellFooter,
  CellsTitle, CellsTips, Input,
  Button } from 'react-weui';
import { reduxForm } from 'redux-form';
import { required, range } from '../../../validates';
import { REQUIRED } from '../../../err-codes';

const validate = values => {
  const errors = {
    name: required(values.name),
    year: required(values.year) || range(values.year, 1900, 2100),
  };
  return errors;
};

export class AddCareerComponent extends React.Component {
  static propTypes = {
    add: PropTypes.func.isRequired,
    err: PropTypes.object,
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  render() {
    const { fields: { name, year }, add } = this.props;

    const submitNew = (values) => (add(values).then(() => {
      this.props.resetForm();
    }));

    return (
      <Form>
        <CellsTitle>添加工作经历</CellsTitle>
        <FormCell warn={!!(name.touched && name.error)}>
          <CellHeader>公司</CellHeader>
          <CellBody>
            <Input placeholder="公司或单位名称" {...name} />
          </CellBody>
          <CellFooter><Icon value="warn" /></CellFooter>
        </FormCell>
        <FormCell warn={!!(year.touched && year.error)}>
          <CellHeader>入职年份</CellHeader>
          <CellBody>
            <Input placeholder="入职年份"
              type="number" min={1900} max={2200} {...year}
            />
          </CellBody>
          <CellFooter><Icon value="warn" /></CellFooter>
        </FormCell>
        {
          name.touched && name.error ? (
            <CellsTips>* 必须输入公司/单位名称</CellsTips>
          ) : null
        }
        {
          year.touched && year.error === REQUIRED ? (
            <CellsTips>* 必须填写入职年份</CellsTips>
          ) : null
        }
        {
          year.touched && year.error !== REQUIRED ? (
            <CellsTips>* 入职年份必须是正确的4为数字</CellsTips>
          ) : null
        }

        <Button onClick={this.props.handleSubmit(submitNew)}>添加</Button>
      </Form>
    );
  }
}
export default reduxForm({
  form: 'careerHistory',
  fields: ['name', 'year'],
  validate,
})(AddCareerComponent);
