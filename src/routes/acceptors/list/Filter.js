import React, { PropTypes } from 'react';
import { Form, FormCell, CellsTitle, CellBody, CellHeader,
  Panel, PanelHeader, PanelBody,
  Select, Button, SearchBar, CellFooter, Switch } from 'react-weui';
import { reduxForm } from 'redux-form';
import * as actions from '../../../actions/acceptors/list';
import * as commonActions from '../../../actions/common';

class Filter extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    fields: PropTypes.object,
    fetchAcceptors: PropTypes.func.isRequired,
    clean: PropTypes.func.isRequired,
    query: PropTypes.object,
  };
  render() {
    const { clean, values, fetchAcceptors } = this.props;
    let searchTimeoutId = null;
    const search = (text) => {
      /*
      为了避免多次提交请求，这里延迟一秒。
      一秒之内如果再次触发onChange事件，则取消上一个动作。
       */
      clearTimeout(searchTimeoutId);
      searchTimeoutId = setTimeout(() => {
        // console.log(this.props.values);
        clean();
        fetchAcceptors({
          text,
          pageIndex: 0,
          ...values,
        });
      }, 1000);
    };

    const { year, project, text } = this.props.fields;
    return (
      <div>
        <SearchBar placeholder="搜索姓名" {...text} onChange={search} />
        <Panel>
          <PanelHeader>
            筛选
          </PanelHeader>
          <PanelBody>
            <FormCell select>
              <CellBody>
                <Select {...year} >
                  <option value="">年份</option>
                  <option>2006</option>
                  <option>2007</option>
                  <option>2008</option>
                  <option>2009</option>
                  <option>2010</option>
                  <option>2011</option>
                  <option>2012</option>
                  <option>2013</option>
                  <option>2014</option>
                  <option>2015</option>
                  <option>2016</option>
                </Select>
              </CellBody>
            </FormCell>
            <FormCell select>
              <CellBody>
                <Select {...project} >
                  <option value="">项目</option>
                  <option>奖学金</option>
                  <option>助学金</option>
                  <option>其他</option>
                </Select>
              </CellBody>
            </FormCell>
            <Button
              onClick={() => {
                clean();
                fetchAcceptors({
                  pageIndex: 0,
                  ...values,
                });
              }}
            >
              查询
            </Button>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.acceptors.list,
});

export default reduxForm({
  form: 'acceptorsList',
  fields: ['year', 'project'],
}, mapStateToProps, { ...actions, ...commonActions })(Filter);
