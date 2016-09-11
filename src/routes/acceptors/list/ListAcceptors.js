import React, { PropTypes } from 'react';
import { Cells, Cell, CellFooter, CellBody,
  Panel, PanelHeader, PanelBody,
  MediaBox, Msg,
  Button } from 'react-weui';
import NeedSignup from '../../../components/NeedSignup';
import * as actions from '../../../actions/acceptors/list';
import * as commonActions from '../../../actions/common';
import LoadingToast from '../../../components/LoadingToast';
import Filter from './Filter';
import { reduxForm } from 'redux-form';

class ListAcceptors extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    totalCount: PropTypes.number,
    error: PropTypes.object,
    fetchAcceptors: PropTypes.func.isRequired,
    clean: PropTypes.func.isRequired,
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
  render() {
    const { data, totalCount, showToast, error } = this.props;
    const nextPage = () => {
      const { fetchAcceptors, query } = this.props;
      query.pageIndex++;
      fetchAcceptors(query);
    }
    return (
      <div className="progress">
        <NeedSignup />
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
                  ? <Button onClick={nextPage}>
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

export default reduxForm({
  form: 'acceptorsList',
  fields: ['pageIndex', 'year', 'project', 'text'],
}, mapStateToProps, { ...actions, ...commonActions })(ListAcceptors);
