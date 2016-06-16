/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Toast, Msg } from 'react-weui';
import CareerHistory from '../detail/CareerHistory';
import AddCareer from './AddCareer';
import RemoveCareer from './RemoveCareer';
import { connect } from 'react-redux';

export class EditCareerComponent extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    add: PropTypes.func,
    remove: PropTypes.func,
    init: PropTypes.func,
    err: PropTypes.object,
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
    const { err, history, add, remove, toast } = this.props;

    return err ? <Msg type="warn" title="发生错误" description={JSON.stringify(err.msg)} /> : (
      <div>
        <CareerHistory history={history} />
        <AddCareer add={add} />
        <RemoveCareer remove={remove} history={history} />
        <Toast icon={toast.icon} show={toast.show} >{toast.text}</Toast>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  history: state.acceptors.careerHistory.data,
  error: state.acceptors.careerHistory.error,
  toast: state.acceptors.careerHistory.toast,
});
export default connect(mapStateToProps)(EditCareerComponent);
