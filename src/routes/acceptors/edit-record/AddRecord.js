/*
eslint-disable react/prefer-stateless-function
 */


import React, { PropTypes } from 'react';
import { Form, FormCell, Icon, Select,
  CellHeader, CellBody, CellFooter,
  CellsTitle, CellsTips, Input,
  Button } from 'react-weui';
import { reduxForm } from 'redux-form';
import { required, range, integer,
  REQUIRED, INVALID_NUMBER,
    TOO_LARGE_NUMBER, TOO_SMALL_NUMBER,
    INVALID_INTEGER } from 'nagu-validates';

class AddRecord extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    acceptorId: PropTypes.string.isRequired,
  };
  render() {
    const { fields: { project, date, amount, recommander, remark },
      add, resetForm, submitting, acceptorId } = this.props;
    const submit = values => add(acceptorId, {
      ...values,
      amount: values.amount * 1000,
    }).then(() => resetForm());
    return (
      <Form>
        <CellsTitle>添加受赠记录</CellsTitle>
        <FormCell select warn={!!(project.touched && project.error)}>
          <CellBody>
            <Select {...project} data={[{
              value: '',
              label: '请选择项目',
            }, {
              value: '奖学金',
              label: '奖学金',
            }, {
              value: '助学金',
              label: '助学金',
            }, {
              value: '其他',
              label: '其他',
            }]}
            />
        </CellBody>
        </FormCell>
        <FormCell warn={!!(date.touched && date.error)}>
          <CellHeader>日期</CellHeader>
          <CellBody>
            <Input type="date" placeholder="受赠金额" {...date} />
          </CellBody>
          <CellFooter><Icon value="warn" /></CellFooter>
        </FormCell>
        <FormCell warn={!!(amount.touched && amount.error)}>
          <CellHeader>金额</CellHeader>
          <CellBody>
            <Input type="number" placeholder="受赠金额" {...amount} />
          </CellBody>
          <CellFooter><Icon value="warn" /></CellFooter>
        </FormCell>
        <FormCell>
          <CellHeader>推荐人</CellHeader>
          <CellBody>
            <Input placeholder="推荐人" {...recommander} />
          </CellBody>
          <CellFooter><Icon value="warn" /></CellFooter>
        </FormCell>
        <FormCell>
          <CellHeader>备注</CellHeader>
          <CellBody>
            <Input placeholder="备注" {...remark} />
          </CellBody>
        </FormCell>
        {
          project.touched && project.error ? (
            <CellsTips>* 必须选择项目</CellsTips>
          ) : null
        }
        {/*{
          date.touched && date.error ? (
            <CellsTips>* 必须指定日期</CellsTips>
          ) : null
        }*/}
        {
          amount.touched && amount.error ? (
            <CellsTips>* 必须填写金额</CellsTips>
          ) : null
        }
        <Button onClick={this.props.handleSubmit(submit)} disabled={submitting}>添加</Button>
      </Form>
    )
  }
}

const validate = values => ({
  project: required(values.project),
  // date: required(values.date),
  amount: required(values.amount),
});
export default reduxForm({
  form: 'acceptRecords',
  fields: ['project', 'date', 'amount', 'recommander', 'remark'],
  validate,
})(AddRecord);
