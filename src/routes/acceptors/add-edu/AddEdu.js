/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react'
import { Form, FormCell,
  CellHeader, CellBody, CellFooter,
  CellsTitle, Input } from 'react-weui';
class AddEdu extends React.Component {
  render () {
    return (
      <Form>
        <CellsTitle>添加教育经历</CellsTitle>
        <FormCell>
          <CellHeader>学校</CellHeader>
          <CellBody>
            <Input placeholder="学校名称" />
          </CellBody>
        </FormCell>
        <FormCell>
          <CellHeader>入学年份</CellHeader>
          <CellBody>
            <Input placeholder="入学年份" />
          </CellBody>
        </FormCell>
      </Form>
    );
  }
}

export default AddEdu;
