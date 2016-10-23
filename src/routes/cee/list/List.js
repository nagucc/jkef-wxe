import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Panel, PanelHeader, PanelBody,
  MediaBox, MediaBoxTitle, MediaBoxDescription, MediaBoxInfo, Msg } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import * as actions from '../../../actions/cee/list';
import * as commonActions from '../../../actions/common';
import LoadingToast from '../../../components/LoadingToast';

class List extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    error: PropTypes.object,
    fetchCeeResult: PropTypes.func.isRequired,
    showToast: PropTypes.bool,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.context.setTitle('奖学金申报列表');
    this.props.fetchCeeResult();
  }
  render() {
    const { data, showToast, error } = this.props;
    return (
      <div className="progress">
        <NeedSignup />
          {
            error ? <Msg type="warn" title="发生错误" description={error.msg} /> : (
              <div className="bd">
                <Panel>
                  <PanelHeader>
                    共计{data.length}人
                  </PanelHeader>
                  <PanelBody>
                    {
                      data.map(acc => (
                        <MediaBox type="text" key={acc._id}>
                          <MediaBoxTitle>{acc.name}</MediaBoxTitle>
                          <MediaBoxDescription>
                            {acc.university} | {acc.major} | {acc.degree}
                          </MediaBoxDescription>
                          <MediaBoxInfo data={[{
                            label: `成绩：${acc.grade}`,
                          }, {
                            lable: acc.graduation,
                          }, {
                            label: acc.style,
                          }, {
                            label: `电话：${acc.tel}`,
                          }]}
                          />
                        </MediaBox>
                      ))
                    }
                  </PanelBody>
                </Panel>
              </div>
            )
          }
        <LoadingToast show={showToast} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.cee.list,
});

export default connect(mapStateToProps, { ...actions, ...commonActions })(List);
