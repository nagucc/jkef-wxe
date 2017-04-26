/*
添加用户的教育经历
 */
/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Form, FormCell, Icon,
  CellHeader, CellBody, CellFooter,
  CellsTitle, CellsTips, Input, Cells, Cell,
  Button } from 'react-weui';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { required, range, integer, REQUIRED, INVALID_NUMBER,
  TOO_LARGE_NUMBER, TOO_SMALL_NUMBER,
  INVALID_INTEGER } from 'nagu-validates';

const validate = (values) => {
  const errors = {
    name: required(values.name),
    year: required(values.year) || integer(values.year) || range(values.year, 1900, 2100),
  };
  return errors;
};

class AddCareerComponent extends React.Component {
  static propTypes = {
    add: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  render() {
    const { add } = this.props;

    const submitNew = values => (add(values).then(() => {
      this.props.reset();
    }));
    return (
      <div>
        <CellsTitle>添加工作经历</CellsTitle>
        <Cells>
          <Cell>
            <CellHeader>公司</CellHeader>
            <CellBody>
              <Field name="name" component="input" className="weui-input" placeholder="公司或单位名称" />
            </CellBody>
          </Cell>
          <Cell>
            <CellHeader>入职年份</CellHeader>
            <CellBody>
              <Field
                type="number"
                name="year" component="input"
                min={1900} max={2200}
                className="weui-input" placeholder="入职年份"
              />
            </CellBody>
          </Cell>
        </Cells>
        <Button onClick={this.props.handleSubmit(submitNew)}>添加</Button>
      </div>
    );
  }
}
export default reduxForm({
  form: 'careerHistory',
  // fields: ['name', 'year'],
  // validate,
})(AddCareerComponent);
