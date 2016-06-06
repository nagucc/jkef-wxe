import React from 'react';
import { Button, ButtonArea, Form, FormCell,
  CellHeader, CellBody, Label, CellsTitle, Input } from 'react-weui';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="hd">
          <h1 className="page_title">学生信息</h1>
        </div>
        <div className="bd">
          <form className="formList infoForm" role="form" action="/api/fundinfo" method="post">
            <CellsTitle>请认真填写你的信息资料</CellsTitle>
            <Form>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[0].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" name={this.props.data[0].name} placeholder={'请输入' + this.props.data[0].content} />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[1].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" name={this.props.data[1].name} placeholder={'请输入' + this.props.data[1].content} />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>性别</Label>
                </CellHeader>
                <CellBody>
                  <input type="radio" name="sex" value="男" />
                  <label>男</label>
                  <input type="radio" name="sex" value="女" />
                  <label>女</label>
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>类别</Label>
                </CellHeader>
                <CellBody>
                  <input type="radio" name="type" value="文" />
                  <label>文</label>
                  <input type="radio" name="type" value="理" />
                  <label>理</label>
                  <input type="radio" name="type" value="艺体" />
                  <label>艺体</label>
                </CellBody>
              </FormCell>
              {
                this.props.data.map((item, i) => {
                  if (i !== 0 && i !== 1) return (
                    <FormCell key={i}>
                      <CellHeader>
                        <Label>{item.content}</Label>
                      </CellHeader>
                      <CellBody>
                        <Input type="text" name={item.name} placeholder={'请输入' + item.content} />
                      </CellBody>
                    </FormCell>
                  );
                })
              }
              <ButtonArea direction="vertical">
                <Button type="primary">确定</Button>
                <Button href="#" type="default">返回</Button>
              </ButtonArea>
            </Form>
          </form>
        </div>
      </div>
    );
  }
}
export default RegistrationForm;

/*
 var FormInput = React.createClass({
 render: function () {
 return (
 <div className="formInput weui_cell">
 <div className="weui_cell_hd">
 <label className="weui_label">{this.props.content}</label>
 </div>
 <div className="weui_cell_bd weui_cell_primary">
 <input className="weui_input" name={this.props.name}
 type="text" placeholder={"请输入"+this.props.content}/>
 </div>
 </div>
 );
 }
 });
 var FormButton = React.createClass({
 render: function () {
 return (
 <div className="weui_btn_area">
 <button type="submit" className="weui_btn weui_btn_primary">确定</button>
 <a href="#" className="weui_btn weui_btn_default">返回</a>
 </div>
 );
 }
 });*/
