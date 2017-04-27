/*
添加用户的教育经历
 */
/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Form, FormCell, Icon,
  CellHeader, CellBody, CellFooter,
  CellsTitle, CellsTips, Input, Cells, Cell, ButtonArea,
  Button } from 'react-weui';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { required, range, integer, REQUIRED, INVALID_NUMBER,
  TOO_LARGE_NUMBER, TOO_SMALL_NUMBER,
  INVALID_INTEGER } from 'nagu-validates';

// const validate = (values) => {
//   const errors = {
//     name: required(values.name),
//     year: required(values.year) || integer(values.year) || range(values.year, 1900, 2100),
//   };
//   return errors;
// };

class AddEdu extends React.Component {
  static propTypes = {
    add: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  render() {
    const { add, handleSubmit, acceptorId, reset } = this.props;

    const submitNew = async (values) => {
      await add(acceptorId, values);
      reset();
    };
    return (
      <div>
        <CellsTitle>添加教育经历</CellsTitle>
        <Cell>
          <CellHeader>学校</CellHeader>
          <CellBody>
            <Field component="input" name="name" className="weui-input" placeholder="学校名称" />
          </CellBody>
        </Cell>
        <Cell>
          <CellHeader>层次</CellHeader>
          <CellBody>
            <Field defaultValue="" component="select" name="degree" className="weui-select">
              <option value="">请选择</option>
              <option value="小学">小学</option>
              <option value="初中">初中</option>
              <option value="高中">高中</option>
              <option value="大学">大学</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </Field>
          </CellBody>
        </Cell>
        <Cell>
          <CellHeader>入学年份</CellHeader>
          <CellBody>
            <Field
              component="input" name="year"
              placeholder="入学年份"
              type="number" min={1900} max={2200}
              className="weui-input"
            />
          </CellBody>
        </Cell>
        <ButtonArea>
          <Button onClick={handleSubmit(submitNew)}>添加</Button>
        </ButtonArea>
      </div>
    );
  }
}
export default reduxForm({
  form: 'eduHistory',
})(AddEdu);
