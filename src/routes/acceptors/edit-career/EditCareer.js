/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Form, FormCell,
  CellHeader, CellBody,
  CellsTitle, Input, Select,
  Button, Msg, Toast } from 'react-weui';
import CareerHistory from '../detail/CareerHistory';
import { reduxForm } from 'redux-form';

export class EditCareerComponent extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    add: PropTypes.func,
    remove: PropTypes.func,
    init: PropTypes.func,
    err: PropTypes.object,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    toast: PropTypes.object,
  };
  static defaultProps = {
    history: [],
  };
  componentDidMount() {
    this.props.init();
  }
  render() {
    const { err, history, fields, add, remove, toast } = this.props;

    const submitNew = async () => {
      await add({
        name: fields.name.value,
        year: parseInt(fields.year.value, 10),
      });
      this.props.resetForm();
    };
    const submitRemove = () => {
      remove(JSON.parse(fields.needRemove.value))
        .then(() => this.props.resetForm());
    };

    return err ? <Msg type="warn" title="发生错误" description={JSON.stringify(err.msg)} /> : (
      <div>
        <CareerHistory history={history} />
        <Form>
          <CellsTitle>添加工作经历</CellsTitle>
          <FormCell>
            <CellHeader>公司</CellHeader>
            <CellBody>
              <Input placeholder="公司或单位名称" {...fields.name} />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>入职年份</CellHeader>
            <CellBody>
              <Input placeholder="入职年份"
                type="number" min={1900} max={2200} {...fields.year}
              />
            </CellBody>
          </FormCell>
          <Button onClick={submitNew}>添加</Button>
        </Form>
        <Form>
          <CellsTitle>删除工作经历</CellsTitle>
        <FormCell>
          <CellHeader>
            <Select {...fields.needRemove} data={[{
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
        <Button type="warn" onClick={submitRemove}>删除</Button>
        </Form>
        <Toast icon={toast.icon} show={toast.show} >{toast.text}</Toast>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  // error 变量被redux-form使用，因此只能改用其他名字
  history: state.acceptors.careerHistory.data,
  err: state.acceptors.careerHistory.error,
  toast: state.acceptors.careerHistory.toast,
});
export default reduxForm({
  form: 'careerHistory',
  fields: ['name', 'year', 'eduNeedDelete'],
}, mapStateToProps)(EditCareerComponent);
