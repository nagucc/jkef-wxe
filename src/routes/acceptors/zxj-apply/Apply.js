import React, { PropTypes } from 'react';
import { CellsTitle, CellHeader, CellBody, CellsTips, Cell, TextArea, Cells,
  Form, FormCell, Input, Msg, Button, ButtonArea, Uploader, CellFooter } from 'react-weui';

import NeedSignup from '../../../components/NeedSignup';
import MustHaveProfile from '../../../components/Profile/MustHaveProfile';
import { reduxForm } from 'redux-form';
import * as profileActions from '../../../actions/profile';
import * as eduActions from '../../../actions/acceptors/edu';

class Apply extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    error: PropTypes.object,
    fields: PropTypes.object,
    profile: PropTypes.object,
    school: PropTypes.object,
    fetchedMyProfile: PropTypes.func.isRequired,
    initEduHistory: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      idCardPhotoes: [],
      stuCardPhotoes: [],
      scorePhotoes: [],
    };
  }
  render() {
    const { error, fetchedMyProfile, profile, initEduHistory, school,
      fields: { homeAddress, nation, familyIncomeIntro, publicActivtesIntro } } = this.props;

    const changeIdCardPhoto = file => {
      this.setState({
        idCardPhotoes: [{
          url: file.data,
        }],
      });
    };
    const clearIdCardPhoto = () => this.setState({
      idCardPhotoes: [],
    });
    const changeStuCardPhotoes = file => {
      const oldPhotoes = this.state.stuCardPhotoes;
      this.setState({
        stuCardPhotoes: [
          ...oldPhotoes,
          {
            url: file.data,
          }],
      });
    };
    const clearStuCardPhotoes = () => this.setState({
      stuCardPhotoes: [],
    });
    const changeScorePhotoes = file => {
      const oldPhotoes = this.state.scorePhotoes;
      this.setState({
        scorePhotoes: [
          ...oldPhotoes,
          {
            url: file.data,
          }],
      });
    };
    const clearScorePhotoes = () => this.setState({
      scorePhotoes: [],
    });

    return (
      <div className="progress">
        <NeedSignup />
        <MustHaveProfile success = {data => {
          fetchedMyProfile(data);
          initEduHistory(data._id);
        }}
        />
        <div className="hd">
          <h1 className="page_title">{profile.name}</h1>
        </div>
        <div className="bd">
        {
          error ? <Msg type="warn" title="发生错误" description={error.msg} />
          : (
            <Form>
            <CellsTitle>填写下面信息</CellsTitle>
              <FormCell>
                <CellHeader>就读学校</CellHeader>
                {
                  school.name ? (
                    <CellBody>{school.name} | {school.degree} | {school.year}年入学</CellBody>
                  ) : null
                }
              </FormCell>
              <CellsTips>
                <p>就读学校将自动从教育经历中选取</p>
                <Button href={`/acceptors/edit-edu/${profile._id}`}
                  size="small" type="default"
                >添加教育经历</Button>
              </CellsTips>

              <FormCell>
                <CellHeader>家庭住址</CellHeader>
                <CellBody>
                  <Input placeholder="请输入家庭住址" {...homeAddress} />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>民族</CellHeader>
                <CellBody>
                  <Input placeholder="请输入民族，如：回族" {...nation} />
                </CellBody>
              </FormCell>
              <CellsTitle>家庭经济收入情况</CellsTitle>
              <FormCell>
                <CellBody>
                  <TextArea placeholder="家庭经济收入情况" rows="5" {...familyIncomeIntro} />
                </CellBody>
              </FormCell>
              <CellsTitle>参加公益活动的经历</CellsTitle>
              <FormCell>
                <CellBody>
                  <TextArea placeholder="参加公益活动的经历" rows="5" {...publicActivtesIntro} />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellBody>
                  <Uploader title="身份证正面照片"
                    maxCount={1}
                    files={this.state.idCardPhotoes}
                    onChange={changeIdCardPhoto}
                  />
                </CellBody>
              </FormCell>
              <CellsTips>
                <Button onClick={clearIdCardPhoto} size="small" type="default">
                  清空身份证照片
                </Button>
              </CellsTips>
              <FormCell>
                <CellBody>
                  <Uploader title="学生证照片"
                    maxCount={4}
                    files={this.state.stuCardPhotoes}
                    onChange={changeStuCardPhotoes}
                  />
                </CellBody>
              </FormCell>
              <CellsTips>
                <Button onClick={clearStuCardPhotoes} size="small" type="default">
                  清空学生证照片
                </Button>
                <p>注意：学生证照片必须包含封面，及带照片、基本信息及注册章的内页</p>
              </CellsTips>
              <FormCell>
                <CellBody>
                  <Uploader title="成绩证明照片"
                    maxCount={10}
                    files={this.state.scorePhotoes}
                    onChange={changeScorePhotoes}
                  />
                </CellBody>
              </FormCell>
              <CellsTips>
                <Button onClick={clearScorePhotoes} size="small" type="default">
                  清空成绩证明照片
                </Button>
                <p>注意：成绩正面照片应当清晰可见</p>
              </CellsTips>
              <ButtonArea>
                <Button>确定</Button>
              </ButtonArea>
            </Form>
          )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const eduHistory = state.acceptors.eduHistory.data;
  let school = {};
  if (eduHistory.length) {
    school = eduHistory.reduce((prev, cur) => {
      return prev.year > cur.year ? prev : cur;
    });
    console.log(school);
  }
  return {
    me: state.me,
    profile: state.profile.me,
    school,
    initialValues: state.acceptors.registration.data,
  };
};
export default reduxForm({
  form: 'zxjApply',
  fields: ['homeAddress', 'nation', 'familyIncomeIntro', 'publicActivtesIntro'],
}, mapStateToProps, { ...profileActions, ...eduActions })(Apply);