/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Cell, CellBody, CellFooter,
  Panel, PanelHeader,
  PanelBody } from 'react-weui';

class RecordHistory extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };
  render() {
    return (
      <Panel access>
        <PanelHeader>奖赠记录</PanelHeader>
        <PanelBody>
          {
            this.props.data.map((record, i) => (
              <Cell key={i} >
                <CellBody>{record.project} | {record.amount}</CellBody>
                <CellFooter>
                  {record.year}年
                </CellFooter>
              </Cell>
            ))
          }
          <Cell>
            <CellBody>奖学金 | 1,000</CellBody>
            <CellFooter>
              2001年
            </CellFooter>
          </Cell>
        </PanelBody>
      </Panel>
    );
  }
}

export default RecordHistory;
