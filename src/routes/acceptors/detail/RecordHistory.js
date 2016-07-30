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
  static defaultProps = {
    data: [],
  };
  render() {
    return (
      <Panel access>
        <PanelHeader>奖赠记录</PanelHeader>
        <PanelBody>
          {
            this.props.data.map((record, i) => (
              <Cell key={i} >
                <CellBody>{record.project} | {record.amount / 1000}</CellBody>
                <CellFooter>
                  {(new Date(record.date)).getFullYear()}年
                </CellFooter>
              </Cell>
            ))
          }
        </PanelBody>
      </Panel>
    );
  }
}

export default RecordHistory;
