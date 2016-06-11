/*
添加用户的教育经历
 */
import React, { PropTypes } from 'react';
import { Form, FormCell,
  CellHeader, CellBody,
  CellsTitle, Input, Select,
  Button } from 'react-weui';
import EduHistory from '../detail/EduHistory';

class EditEdu extends React.Component {
  render() {
    return (
      <div>
        <EduHistory />
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
          <Button>确定</Button>
        </Form>
        <Form>
          <CellsTitle>删除教育经历</CellsTitle>
        <FormCell>
          <CellHeader>
            <Select data={[{
              value: '',
              label: '请选择',
            }, {
              value: 'xx',
              label: '云南省时又林业是身份大学',
            }]}
            />
          </CellHeader>
        </FormCell>
        <Button type="warn">删除</Button>
        </Form>
      </div>
    );
  }
}

export default EditEdu;
