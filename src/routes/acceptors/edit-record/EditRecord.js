/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Toast, Msg } from 'react-weui';
import AcceptHistory from '../detail/AcceptHistory';
import AddCareer from './AddCareer';
import RemoveCareer from './RemoveCareer';
import { connect } from 'react-redux';

export class EditRecordComponent extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    add: PropTypes.func,
    remove: PropTypes.func,
    init: PropTypes.func,1
    err: PropTypes.object,
    fields: PropTypes.object,
    toast: PropTypes.object,
  };
  static defaultProps = {
    data: [],
  };
  componentDidMount() {
    this.props.init();
  }
  render() {
    const { err, data, add, remove, toast } = this.props;

    return err ? <Msg type="warn" title="发生错误" description={JSON.stringify(err.msg)} /> : (
      <div>
        <AcceptHistory history={data} />
        {/*<AddCareer add={add} />
        <RemoveCareer remove={remove} history={history} />*/}
        <Toast icon={toast.icon} show={toast.show} >{toast.text}</Toast>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.acceptors.careerHistory.data,
});
export default connect(mapStateToProps)(EditRecordComponent);
