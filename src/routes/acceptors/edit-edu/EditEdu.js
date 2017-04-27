/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Msg, Toast } from 'react-weui';
import EduHistory from '../detail/EduHistory';
import AddEdu from './AddEdu';
import RemoveEdu from './RemoveEdu';
import * as actions from '../../../actions/acceptors/edu';

export class EditEduComponent extends React.Component {
  static propTypes = {
    eduHistory: React.PropTypes.array,
    addEdu: PropTypes.func,
    deleteEdu: PropTypes.func,
    initEduHistory: PropTypes.func.isRequired,
    err: PropTypes.object,
    toast: PropTypes.object,
  };
  static defaultProps = {
    eduHistory: [],
  };
  componentDidMount() {
    this.props.initEduHistory(this.props.acceptorId);
  }
  render() {
    const { err, eduHistory, addEdu, deleteEdu, toast, acceptorId } = this.props;

    return err ? <Msg type="warn" title="发生错误" description={JSON.stringify(err.msg)} /> : (
      <div>
        <EduHistory history={eduHistory} />
        <AddEdu add={addEdu} acceptorId={acceptorId} />
        <RemoveEdu remove={deleteEdu} history={eduHistory} acceptorId={acceptorId} />
        <Toast icon="loading" show={toast.loading} >加载中</Toast>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  // error 变量被redux-form使用，因此只能改用其他名字
  eduHistory: state.acceptors.eduHistory.data,
  err: state.acceptors.eduHistory.error,
  ...state.wechat,
});
export default connect(mapStateToProps, {
  ...actions,
})(EditEduComponent);
