import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Cells, Cell, CellFooter, CellBody,
  Panel, PanelHeader, PanelBody,
  MediaBox, Msg,
  Button, SearchBar } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import * as actions from '../../../actions/acceptors/list';
import * as commonActions from '../../../actions/common';
import LoadingToast from '../../../components/LoadingToast';

class ListAcceptors extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    totalCount: PropTypes.number,
    error: PropTypes.object,
    fetchAcceptors: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    query: PropTypes.object,
    showToast: PropTypes.bool,
  };
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.context.setTitle('成员列表');
    this.props.fetchAcceptors(this.props.query);
  }
  nextPage() {
    const { fetchAcceptors, query } = this.props;
    query.pageIndex++;
    fetchAcceptors(query);
  }
  render() {
    const { data, totalCount, showToast, error, fetchAcceptors, query, reset } = this.props;
    let searchTimeoutId = null;
    const search = text => {
      /*
      为了避免多次提交请求，这里延迟一秒。
      一秒之内如果再次触发onChange事件，则取消上一个动作。
       */
      clearTimeout(searchTimeoutId);
      searchTimeoutId = setTimeout(() => {
        query.text = text;
        query.pageIndex = 0;
        reset();
        fetchAcceptors(query);
      }, 1000);
    };
    return (
      <div className="progress">
        <NeedSignup />
          {
            error ? <Msg type="warn" title="发生错误" description={error.msg} /> : (
              <div className="bd">
                <SearchBar placeholder="搜索姓名" onChange={search} />
                <Panel>
                  <PanelHeader>
                    受赠者列表
                  </PanelHeader>
                  <PanelBody>
                    <MediaBox type="small_appmsg">
                      <Cells access>
                        {
                          data.map(acc => (
                            <Cell href={`/acceptors/detail/${acc._id}`} key={acc._id}>
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
                  ? <Button onClick={this.nextPage.bind(this)}>
                      加载更多({`${data.length}/${totalCount}`})
                    </Button>
                : null
                }
              </div>
            )
          }
        <LoadingToast show={showToast} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.acceptors.list,
});

export default connect(mapStateToProps, { ...actions, ...commonActions })(ListAcceptors);
