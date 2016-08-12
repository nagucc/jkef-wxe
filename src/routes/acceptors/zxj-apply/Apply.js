import React, { PropTypes } from 'react';
import { CellsTitle, CellHeader, CellBody, CellsTips, TextArea,
  Form, FormCell, Input, Msg, Button, ButtonArea } from 'react-weui';

import NeedSignup from '../../../components/NeedSignup';
import MustHaveProfile from '../../../components/Profile/MustHaveProfile';
import { reduxForm } from 'redux-form';
import * as profileActions from '../../../actions/profile';
import * as eduActions from '../../../actions/acceptors/edu';
import * as zxjApplyActions from '../../../actions/acceptors/zxj-apply';
import fetch from '../../../core/fetch';
import ImageUploaderCell from './ImageUploaderCell';
import { required, range, integer } from 'nagu-validates';

const validate = values => {
  const errors = {
    referer: required(values.referer),
    homeAddress: required(values.homeAddress),
    nation: required(values.nation),
    familyIncomeIntro: required(values.familyIncomeIntro),
    publicActivtesIntro: required(values.publicActivtesIntro),
  }
}
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
      stuCardPhotoIds: [],
      scorePhotoIds: [],
      otherPhotoIds: [],
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
      fields: { referer, homeAddress, nation, familyIncomeIntro, publicActivtesIntro } } = this.props;

    const setIdCardPhotoId = serverId => this.setState({
      idCardPhotoId: serverId,
    });
    const clearIdCardPhotoId = () => this.setState({
      idCardPhotoId: undefined,
    });

    const addStuCardPhotoId = serverId => {
      const { stuCardPhotoIds } = this.state;
      this.setState({
        stuCardPhotoIds: [
          ...stuCardPhotoIds,
          serverId,
        ] });
    };
    const clearStuCardPhotoIds = () => this.setState({
      stuCardPhotoIds: [],
    });

    const addScorePhotoId = serverId => {
      const { scorePhotoIds } = this.state;
      this.setState({
        scorePhotoIds: [
          ...scorePhotoIds,
          serverId,
        ] });
    };
    const clearScorePhotoeIds = () => this.setState({
      scorePhotoIds: [],
    });

    const addOtherPhotoId = serverId => {
      const { otherPhotoIds } = this.state;
      this.setState({
        otherPhotoIds: [
          ...otherPhotoIds,
          serverId,
        ] });
    };
    const clearOtherPhotoIds = () => this.setState({
      otherPhotoIds: [],
    });

    const submit = values => {
      addApply(profile._id, {
        ...values,
        name: profile.name,
        schoolName: school.name,
        year: school.year,
        degree: school.degree,
        ...this.state,
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
                <CellHeader>推荐人</CellHeader>
                <CellBody>
                  <Input placeholder="推荐人姓名" {...referer} />
                </CellBody>
              </FormCell>
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
              <ImageUploaderCell title="身份证正面照片"
                maxCount={1}
                clearButtonText="清空身份证照片"
                OnWxUpload={setIdCardPhotoId}
                OnClear={clearIdCardPhotoId}
              />
              <ImageUploaderCell title="学生证照片"
                maxCount={4}
                clearButtonText="清空学生证照片"
                tip="注意：学生证照片必须包含封面，及带照片、基本信息及注册章的内页"
                OnWxUpload={addStuCardPhotoId}
                OnClear={clearStuCardPhotoIds}
              />
              <ImageUploaderCell title="成绩证明照片"
                clearButtonText="清空成绩证明照片"
                tip="注意：成绩正面照片应当清晰可见"
                OnWxUpload={addScorePhotoId}
                OnClear={clearScorePhotoeIds}
              />
              <ImageUploaderCell title="其他证明文件"
                tip="用于证明家庭经济条件、参与公益活动情况的图片资料"
                OnWxUpload={addOtherPhotoId}
                OnClear={clearOtherPhotoIds}
              />
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
  fields: ['referer', 'homeAddress', 'nation', 'familyIncomeIntro', 'publicActivtesIntro'],
}, mapStateToProps, {
  ...profileActions,
  ...eduActions,
  ...zxjApplyActions })(Apply);
