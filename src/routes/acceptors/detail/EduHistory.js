/*
eslint-disable react/prefer-stateless-function
 */
import React, { PropTypes } from 'react';
import { Cell, CellBody, CellFooter,
  Panel, PanelHeader,
  PanelBody } from 'react-weui';

class EduHistory extends React.Component {
  static propTypes = {
    history: PropTypes.array.isRequired,
  };
  render() {
    return (
      <Panel access>
        <PanelHeader>教育经历</PanelHeader>
        <PanelBody>
          {
            this.props.history.map((edu, i) => (
              <Cell key={i} >
                <CellBody>{edu.name} | {edu.degree || '其他'}</CellBody>
                <CellFooter>
                  {edu.year}年入学
                </CellFooter>
              </Cell>
            ))
          }
        </PanelBody>
      </Panel>
    );
  }
}

export default EduHistory;
