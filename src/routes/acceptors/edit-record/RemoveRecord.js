/*
添加用户的受赠记录
 */
 /*
 eslint-disable react/prefer-stateless-function
  */
import React, { PropTypes } from 'react';
import { Form, FormCell,
  CellBody, Select,
  CellsTitle,
  Button } from 'react-weui';
import { reduxForm } from 'redux-form';
import { required } from '../../../validates';

const validate = values => {
  const errors = {
    record: required(values.record),
  };
  return errors;
};

export class RemoveRecord extends React.Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    acceptorId: PropTypes.string.isRequired,
  };
  render() {
    const { fields: { record }, handleSubmit,
      remove, data, acceptorId } = this.props;

    const submit = values => remove(acceptorId, values.record);

    return (
      <Form>
        <CellsTitle>删除受赠记录</CellsTitle>
        <FormCell select>
          <CellBody>
            <Select {...record} data={[{
              value: '',
              label: '请选择',
            },
            ...data.map(rec => ({
              value: rec._id,
              label: `${(new Date(rec.date)).getFullYear()}年|${rec.project}|${rec.amount / 1000}`,
            })),
            ]}
            />
        </CellBody>
        </FormCell>
        <Button type="warn" onClick={handleSubmit(submit)}>删除</Button>
      </Form>

    );
  }
}
export default reduxForm({
  form: 'removeRecord',
  fields: ['record'],
  validate,
})(RemoveRecord);
