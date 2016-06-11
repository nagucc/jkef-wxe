import React, { PropTypes } from 'react'
import { Cell, CellBody, CellFooter,
  Icon, Panel, PanelHeader,
  PanelBody, PanelFooter } from 'react-weui';

class EduHistory extends React.Component {
  render () {

    return (
      <Panel access>
        <PanelHeader>教育经历</PanelHeader>
        <PanelBody>
          <Cell>
            <CellBody>玉溪一中</CellBody>
            <CellFooter>
              1998年入学
              <Icon value="clear" style={{ paddingLeft: '5px' }} />
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>云南大学</CellBody>
            <CellFooter>
              2001年入学
              <Icon value="clear" style={{ paddingLeft: '5px' }} />
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>云南大学</CellBody>
            <CellFooter>2005年入学</CellFooter>
          </Cell>
        </PanelBody>
        <PanelFooter>
          <a href="#">添加教育经历</a>
        </PanelFooter>
      </Panel>
    );
  }
}

export default EduHistory;
