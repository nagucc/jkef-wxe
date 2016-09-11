import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Form, FormCell, CellsTitle, CellBody, CellHeader,
  Panel, PanelHeader, PanelBody,
  Select, Button, SearchBar, CellFooter, Switch } from 'react-weui';
import { reduxForm } from 'redux-form';

class Filter extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    fields: PropTypes.object,
  };
  render () {
    const { isRecommaned, isApproved, isIssued, name } = this.props.fields;
    return (
      <div>
        <SearchBar placeholder="搜索姓名" {...name}/>
        <Panel>
          <PanelHeader>
            筛选
          </PanelHeader>
          <PanelBody>
            <FormCell select>
              <CellBody>
                <Select {...isRecommaned} >
                  <option>推荐状态</option>
                  <option>不推荐</option>
                  <option>已推荐</option>
                </Select>
              </CellBody>
            </FormCell>
            <FormCell select>
              <CellBody>
                <Select {...isApproved} >
                  <option>审核状态</option>
                  <option>未通过审核</option>
                  <option>已通过审核</option>
                </Select>
              </CellBody>
            </FormCell>
            <FormCell select>
              <CellBody>
                <Select {...isIssued} >
                  <option>发放状态</option>
                  <option>不发放</option>
                  <option>已发放</option>
                </Select>
              </CellBody>
            </FormCell>
          </PanelBody>
        </Panel>
      </div>


    )
  }
}

const mapStateToProps = (state) => ({
  ...state.acceptors.list,
});

export default reduxForm({
  form: 'zxjApplyList',
  fields: ['isRecommaned', 'isApproved', 'isIssued', 'name'],
}, mapStateToProps)(Filter);

// export default Filter;
