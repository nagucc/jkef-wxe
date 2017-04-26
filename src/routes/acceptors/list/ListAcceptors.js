import React, { PropTypes } from 'react';
import { Cells, Cell, CellFooter, CellBody,
  Panel, PanelHeader, PanelBody,
  MediaBox, Msg, Toast,
  Button } from 'react-weui';
import { connect } from 'react-redux';
import * as actions from '../../../actions/acceptors/list';
import * as commonActions from '../../../actions/common';
import LoadingToast from '../../../components/LoadingToast';
import Filter from './Filter';
import EnsureSignupWxe from '../../../components/WeChat/EnsureSignupWxe';


class ListAcceptors extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    totalCount: PropTypes.number,
    error: PropTypes.object,
    fetchAcceptors: PropTypes.func.isRequired,
    // clean: PropTypes.func.isRequired,
    query: PropTypes.object,
    showToast: PropTypes.bool,
  };
  componentDidMount() {
    this.props.fetchAcceptors(this.props.query);
  }
  render() {
    const { data, totalCount, toast, error } = this.props;
    const nextPage = () => {
      const { fetchAcceptors, query } = this.props;
      query.pageIndex++;
      fetchAcceptors(query);
    };
    return (
      <div className="progress">
        <EnsureSignupWxe />
        {
            error ? <Msg type="warn" title="发生错误" description={error.msg} /> : (
              <div className="bd">
                <Filter />
                <Panel>
                  <PanelHeader>
                    受赠者列表(共{totalCount}人)
                  </PanelHeader>
                  <PanelBody>
                    <MediaBox type="small_appmsg">
                      <Cells>
                        {
                          data.map(acc => (
                            <Cell href={`/acceptors/detail/${acc._id}`} key={acc._id} access>
                              <CellBody>
                                {acc.name}
                              </CellBody>
                              <CellFooter />
                            </Cell>
                          ))
                        }
                      </Cells>
                    </MediaBox>
                  </PanelBody>
                </Panel>
                {
                  totalCount > data.length
                  ? <Button onClick={nextPage}>
                      加载更多({`${data.length}/${totalCount}`})
                    </Button>
                : null
                }
              </div>
            )
          }
        <Toast icon="loading" show={toast.loading}>加载中</Toast>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.acceptors.list,
  ...state.wechat,
});

// export default reduxForm({
//   form: 'acceptorsList',
//   fields: ['pageIndex', 'year', 'project', 'text'],
// }, mapStateToProps, { ...actions, ...commonActions })(ListAcceptors);

export default connect(mapStateToProps, {
  ...actions,
  ...commonActions,
})(ListAcceptors);
