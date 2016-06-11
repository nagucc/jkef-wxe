import React, { PropTypes } from 'react';
import { Cell, CellBody, CellFooter,
  Panel, PanelHeader,
  PanelBody } from 'react-weui';

class EduHistory extends React.Component {
  render() {
    return (
      <Panel access>
        <PanelHeader>教育经历</PanelHeader>
        <PanelBody>
          <Cell>
            <CellBody>玉溪一中</CellBody>
            <CellFooter>
              1998年入学
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>云南大学</CellBody>
            <CellFooter>
              2001年入学
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>云南大学</CellBody>
            <CellFooter>2005年入学</CellFooter>
          </Cell>
        </PanelBody>
      </Panel>
    );
  }
}

export default EduHistory;
