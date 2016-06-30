import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Cells, Cell, CellFooter, CellBody,
  Panel, PanelHeader, PanelBody,
  MediaBox,
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
  search(text) {
    const { fetchAcceptors, query, reset } = this.props;
    query.text = text;
    query.pageIndex = 0;
    reset();
    fetchAcceptors(query);
  }
  render() {
    const { data, totalCount, showToast } = this.props;
    return (
      <div className="progress">
        <NeedSignup />
        <div className="bd">
          <SearchBar placeholder="搜索姓名" onChange={this.search.bind(this)} />
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
        <LoadingToast show={showToast} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.acceptors.list,
});

export default connect(mapStateToProps, { ...actions, ...commonActions })(ListAcceptors);
