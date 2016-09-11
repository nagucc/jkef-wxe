/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Form, FormCell,
  CellHeader, CellBody,
  CellsTitle, Input, Select, ButtonArea,
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
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.context.setTitle('修改教育经历');
    this.props.initEduHistory();
  }
  render() {
    const { err, eduHistory, fields, addEdu, deleteEdu, toast } = this.props;

    const submitNewEdu = async () => {
      await addEdu({
        name: fields.name.value,
        year: parseInt(fields.year.value, 10),
        degree: fields.degree.value,
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
            <CellHeader>层次</CellHeader>
            <CellBody>
              <Select {...fields.degree} data={[{
                value: '',
                label: '请选择',
              }, {
                value: '小学',
                label: '小学',
              }, {
                value: '初中',
                label: '初中',
              }, {
                value: '高中',
                label: '高中',
              }, {
                value: '大学',
                label: '大学',
              }, {
                value: '硕士',
                label: '硕士',
              }, {
                value: '博士',
                label: '博士',
              }, {
                value: '其他',
                label: '其他',
              },
              ]}
              />
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
          <ButtonArea>
            <Button onClick={submitNewEdu}>添加</Button>
          </ButtonArea>
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
              label: `${edu.name} | ${edu.year}`,
            })),
            ]}
            />
          </CellHeader>
        </FormCell>
        <ButtonArea>
          <Button type="warn" onClick={submitRemoveEdu}>删除</Button>
        </ButtonArea>
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
  fields: ['name', 'year', 'eduNeedDelete', 'degree'],
}, mapStateToProps)(EditEduComponent);
