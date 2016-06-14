/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Form, FormCell,
  CellHeader, CellBody,
  CellsTitle, Input, Select,
  Button, Msg, Toast } from 'react-weui';
import EduHistory from '../detail/EduHistory';
import { reduxForm } from 'redux-form';

export class EditEduComponent extends React.Component {
  static propTypes = {
    eduHistory: React.PropTypes.array,
    addEdu: PropTypes.func,
    deleteEdu: PropTypes.func,
    initEduHistory: PropTypes.func,
    err: PropTypes.object,
    resetForm: PropTypes.func,
    fields: PropTypes.object,
    toast: PropTypes.object,
  };
  static defaultProps = {
    eduHistory: [],
  };
  componentDidMount() {
    this.props.initEduHistory();
  }
  render() {
    const { err, eduHistory, fields, addEdu, deleteEdu, toast } = this.props;

    const submitNewEdu = async () => {
      await addEdu({
        name: fields.name.value,
        year: parseInt(fields.year.value, 10),
      });
      this.props.resetForm();
    };
    const submitRemoveEdu = () => {
      deleteEdu(JSON.parse(fields.eduNeedDelete.value))
        .then(() => this.props.resetForm());
    };

    return err ? <Msg type="warn" title="发生错误" description={JSON.stringify(err.msg)} /> : (
      <div>
        <EduHistory history={eduHistory} />
        <Form>
          <CellsTitle>添加教育经历</CellsTitle>
          <FormCell>
            <CellHeader>学校</CellHeader>
            <CellBody>
              <Input placeholder="学校名称" {...fields.name} />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>入学年份</CellHeader>
            <CellBody>
              <Input placeholder="入学年份"
                type="number" min={1900} max={2200} {...fields.year}
              />
            </CellBody>
          </FormCell>
          <Button onClick={submitNewEdu}>添加</Button>
        </Form>
        <Form>
          <CellsTitle>删除教育经历</CellsTitle>
        <FormCell>
          <CellHeader>
            <Select {...fields.eduNeedDelete} data={[{
              value: '',
              label: '请选择',
            },
            ...eduHistory.map(edu => ({
              value: JSON.stringify(edu),
              label: edu.name,
            })),
            ]}
            />
          </CellHeader>
        </FormCell>
        <Button type="warn" onClick={submitRemoveEdu}>删除</Button>
        </Form>
        <Toast icon={toast.icon} show={toast.show} >{toast.text}</Toast>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  // error 变量被redux-form使用，因此只能改用其他名字
  eduHistory: state.acceptors.eduHistory.data,
  err: state.acceptors.eduHistory.error,
  toast: state.acceptors.eduHistory.toast,
});
export default reduxForm({
  form: 'eduHistory',
  fields: ['name', 'year', 'eduNeedDelete'],
}, mapStateToProps)(EditEduComponent);
