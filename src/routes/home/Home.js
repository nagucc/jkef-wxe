
import React, { PropTypes } from 'react'
import {Form, FormCell, CellHeader,
  Label, CellBody, Input, Button, ButtonArea,
  MediaBox, MediaBoxDescription, Toast} from 'react-weui';

class Home extends React.Component {
  render () {
    return (
      <div className="form">
        <div className="hd">
          <h1 className="page_title">注册</h1>
        </div>
        <div className="bd">
          <Form>
            <FormCell>
              <CellHeader>
                <Label>姓名</Label>
              </CellHeader>
              <CellBody>
                <input className="weui_input" placeholder="请输入姓名" ref="name"/>
              </CellBody>
            </FormCell>
            <ButtonArea>
              <Button type="primary" >确定</Button>
            </ButtonArea>
          </Form>
          <MediaBox>
            <MediaBoxDescription>
              <b>注册成功后，请点击“关注身份验证”，然后使用手机号验证即可。</b>
            </MediaBoxDescription>
          </MediaBox>
        </div>
      </div>
    )
  }
}

export default Home;
