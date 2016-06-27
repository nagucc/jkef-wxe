/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Toast, Msg } from 'react-weui';
import RecordHistory from '../detail/RecordHistory';
import AddRecord from './AddRecord';
import RemoveRecord from './RemoveRecord';
import { connect } from 'react-redux';
import * as actions from '../../../actions/acceptors/record';

export class EditRecordComponent extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    add: PropTypes.func,
    remove: PropTypes.func,
    init: PropTypes.func,
    err: PropTypes.object,
    fields: PropTypes.object,
    toast: PropTypes.object,
    acceptorId: PropTypes.string.isRequired,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.init(this.props.acceptorId);
    this.context.setTitle('修改受赠记录');
  }
  render() {
    const { err, data, toast } = this.props;

    return err ? <Msg type="warn" title="发生错误" description={JSON.stringify(err.msg)} /> : (
      <div>
        <RecordHistory data={data} />
        <AddRecord {...this.props} />
        <RemoveRecord {...this.props} />
        <Toast icon={toast.icon} show={toast.show} >{toast.text}</Toast>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.acceptors.records,
});
const mapDispatchToProps = dispatch => ({
  add: (id, record) => dispatch(actions.addRecord(id, record)),
  init: id => dispatch(actions.initRecords(id)),
  remove: (id, recordId) => dispatch(actions.deleteRecord(id, recordId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditRecordComponent);
