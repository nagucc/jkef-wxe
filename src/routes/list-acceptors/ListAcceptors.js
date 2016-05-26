import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Cells, Cell, CellFooter, CellBody,
  Panel, PanelHeader, PanelBody,
  MediaBox,
  Button, SearchBar } from 'react-weui';

class ListAcceptors extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    totalCount: PropTypes.number,
    dispatch: PropTypes.func,
    fetchAcceptors: PropTypes.func.isRequired,
    cleanAcceptors: PropTypes.func.isRequired,
    query: PropTypes.object,
  };
  nextPage() {
    const { dispatch, fetchAcceptors, query } = this.props;
    query.pageIndex++;
    dispatch(fetchAcceptors(query));
  }
  search(text) {
    const { dispatch, fetchAcceptors, cleanAcceptors, query } = this.props;
    query.text = text;
    query.pageIndex = 0;
    dispatch(cleanAcceptors());
    dispatch(fetchAcceptors(query));
  }
  render() {
    const { data, totalCount } = this.props;
    return (
      <div className="progress">
        <div className="hd">
          <h1 className="page_title">受赠者列表</h1>
        </div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.listAcceptors,
});

export default connect(mapStateToProps)(ListAcceptors);
