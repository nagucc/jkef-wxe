/*
添加用户的教育经历
 */
 /*
 eslint-disable react/prefer-stateless-function
  */
import React, { PropTypes } from 'react';
import { Form, Cell, ButtonArea,
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

class RemoveEdu extends React.Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    reset: PropTypes.func,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
  };
  render() {
    const { handleSubmit, remove, history, acceptorId, reset } = this.props;

    const submitRemove = async (values) => {
      await remove(acceptorId, JSON.parse(values.needRemove));
      reset();
    };

    return (
      <div>
        <CellsTitle>删除教育经历</CellsTitle>
        <Cell>
          <CellHeader>
            <Field defaultValue="" component="select" name="needRemove" className="weui-select">
              <option value="">请选择</option>
              {
                history.map(edu => (
                  <option key={JSON.stringify(edu)} value={JSON.stringify(edu)}>
                    {edu.name} | {edu.year}
                  </option>))
              }
            </Field>
          </CellHeader>
        </Cell>
        <ButtonArea>
          <Button type="warn" onClick={handleSubmit(submitRemove)}>删除</Button>
        </ButtonArea>
      </div>

    );
  }
}
export default reduxForm({
  form: 'eduHistory',
  validate,
})(RemoveEdu);
