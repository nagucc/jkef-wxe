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
import { reduxForm, Field } from 'redux-form';
import { required } from '../../../validates';

const validate = (values) => {
  const errors = {
    needRemove: required(values.needRemove),
  };
  return errors;
};

class RemoveCareerComponent extends React.Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    reset: PropTypes.func,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
  };
  render() {
    const { handleSubmit, remove, history } = this.props;

    const submitRemove = (values) => {
      remove(JSON.parse(values.needRemove))
        .then(() => this.props.reset());
    };

    return (
      <Form>
        <CellsTitle>删除工作经历</CellsTitle>
        <FormCell>
          <CellHeader>
            <Field defaultValue="" name="needRemove" component="select" className="weui-select" >
              <option value="">请选择</option>
              {
                history.map((career, i) => (<option
                  key={i}
                  value={JSON.stringify(career)}
                >
                  {career.name}
                </option>))
              }
            </Field>
          </CellHeader>
        </FormCell>
        <Button type="warn" onClick={handleSubmit(submitRemove)}>删除</Button>
      </Form>

    );
  }
}
export default reduxForm({
  form: 'careerHistory',
  validate,
})(RemoveCareerComponent);
