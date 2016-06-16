/*
添加用户的教育经历
 */
 /*
 eslint-disable react/prefer-stateless-function
  */
import React, { PropTypes } from 'react';
import { Form, FormCell,
  CellHeader, Select,
  CellsTitle,
  Button } from 'react-weui';
import { reduxForm } from 'redux-form';
import { required } from '../../../validates';

const validate = values => {
  const errors = {
    needRemove: required(values.needRemove),
  };
  return errors;
};

export class RemoveCareerComponent extends React.Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
  };
  render() {
    const { fields: { needRemove }, handleSubmit, remove, history } = this.props;

    const submitRemove = () => {
      remove(JSON.parse(needRemove.value))
        .then(() => this.props.resetForm());
    };

    return (
      <Form>
        <CellsTitle>删除工作经历</CellsTitle>
        <FormCell>
          <CellHeader>
            <Select {...needRemove} data={[{
              value: '',
              label: '请选择',
            },
            ...history.map(career => ({
              value: JSON.stringify(career),
              label: career.name,
            })),
            ]}
            />
          </CellHeader>
        </FormCell>
        <Button type="warn" onClick={handleSubmit(submitRemove)}>删除</Button>
      </Form>

    );
  }
}
export default reduxForm({
  form: 'careerHistory',
  fields: ['needRemove'],
  validate,
})(RemoveCareerComponent);
