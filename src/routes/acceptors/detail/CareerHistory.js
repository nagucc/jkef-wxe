/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Cell, CellBody, CellFooter,
  Panel, PanelHeader,
  PanelBody } from 'react-weui';

class CareerHistory extends React.Component {
  static propTypes = {
    history: PropTypes.array.isRequired,
  };
  render() {
    return (
      <Panel access>
        <PanelHeader>工作经历</PanelHeader>
        <PanelBody>
          {
            this.props.history.map((career, i) => (
              <Cell key={i} >
                <CellBody>{career.name}</CellBody>
                <CellFooter>
                  {career.year}年入职
                </CellFooter>
              </Cell>
            ))
          }
        </PanelBody>
      </Panel>
    );
  }
}

export default CareerHistory;
