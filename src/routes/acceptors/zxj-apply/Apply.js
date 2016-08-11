import React, { PropTypes } from 'react';
import { CellsTitle, CellHeader, CellBody, CellsTips, TextArea,
  Form, FormCell, Input, Msg, Button, ButtonArea, Uploader } from 'react-weui';

import NeedSignup from '../../../components/NeedSignup';
import MustHaveProfile from '../../../components/Profile/MustHaveProfile';
import { reduxForm } from 'redux-form';
import * as profileActions from '../../../actions/profile';
import * as eduActions from '../../../actions/acceptors/edu';
import * as zxjApplyActions from '../../../actions/acceptors/zxj-apply';
import fetch from '../../../core/fetch';
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
      stuCardPhotoIds: [],
      scorePhotoIds: [],
    };
  }
  async componentDidMount() {
    let result;
    try {
      const res = await fetch('/api/zxj-apply/jsconfig');
      result = await res.json();
    } catch (e) {
      alert('服务器返回jsconfig时错误');
      return;
    }
    if (result.ret === 0) {
      wx.config(result.data);
    } else {
      alert('服务器返回jsconfig时错误2');
    }
  }
  render() {
    const { error, fetchedMyProfile, profile, initEduHistory, school,
      handleSubmit, addApply,
      fields: { homeAddress, nation, familyIncomeIntro, publicActivtesIntro } } = this.props;

    const changeIdCardPhoto = file => {
      wx.uploadImage({
        localId: file.data,
        success: res => {
          this.setState({
            idCardPhotoes: [{
              url: file.data,
            }],
            idCardPhotoId: res.serverId,
          });
        },
      });
    };
    const clearIdCardPhoto = () => this.setState({
      idCardPhotoes: [],
      idCardPhotoId: undefined,
    });
    const changeStuCardPhotoes = file => {
      const { stuCardPhotoes, stuCardPhotoIds } = this.state;
      wx.uploadImage({
        localId: file.data,
        success: res => {
          this.setState({
            stuCardPhotoes: [
              ...stuCardPhotoes,
              {
                url: file.data,
              }],
            stuCardPhotoIds: [
              ...stuCardPhotoIds,
              res.serverId,
            ],
          });
        },
      });
    };
    const clearStuCardPhotoes = () => this.setState({
      stuCardPhotoes: [],
      stuCardPhotoIds: [],
    });
    const changeScorePhotoes = file => {
      const { scorePhotoes, scorePhotoIds } = this.state;
      wx.uploadImage({
        localId: file.data,
        success: res => {
          this.setState({
            scorePhotoes: [
              ...scorePhotoes,
              {
                url: file.data,
              }],
            scorePhotoIds: [
              ...scorePhotoIds,
              res.serverId,
            ],
          });
        },
      });
    };
    const clearScorePhotoes = () => this.setState({
      scorePhotoes: [],
      scorePhotoIds: [],
    });

    const submit = values => {
      const { idCardPhotoId, stuCardPhotoIds, scorePhotoIds } = this.state;
      addApply(profile._id, {
        ...values,
        name: profile.name,
        schoolName: school.name,
        year: school.year,
        degree: school.degree,
        idCardPhotoId,
        stuCardPhotoIds,
        scorePhotoIds,
      });
    };

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
                <Button onClick={handleSubmit(submit)}>确定</Button>
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
    school = eduHistory.reduce((prev, cur) => prev.year > cur.year ? prev : cur);
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
}, mapStateToProps, {
  ...profileActions,
  ...eduActions,
  ...zxjApplyActions })(Apply);
