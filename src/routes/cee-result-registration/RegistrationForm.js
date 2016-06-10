import React from 'react';
import {
  Button, ButtonArea, Form, FormCell, Select,
  CellHeader, CellBody, Label, CellsTitle, Input,
} from 'react-weui';
import fetch from '../../core/fetch';

class RegistrationForm extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
  };
  static defaultProps = {
    data: [],
  };
  state = {};
  // fetch handle
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      name: this.refs.name.value.trim(),
      id: this.refs.id.value.trim(),
      sex: this.refs.sex.selected,
      type: this.refs.type.selected,
      graduation: this.refs.graduation.value.trim(),
      grade: this.refs.grade.value.trim(),
      university: this.refs.university.value.trim(),
      major: this.refs.major.value.trim(),
      degree: this.refs.degree.value.trim(),
    });
    fetch('/api/fundinfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'bai', id: '1' }),
      // body: JSON.stringify(this.state),
    }).then((data) => {
      const res = JSON.stringify(data);
      if (res.ok) {
        console.log('Request succeeded with JSON response', res);
      } else if (res.status === 401) {
        console.log('Request succeeded with JSON response', res);
      }
    }, (error) => {
      console.log('Request failed', error);
    });
  }
  render() {
    return (
      <div>
        <div className="hd">
          <h1 className="page_title">学生信息</h1>
        </div>
        <div className="bd">
          <form className="infoForm" role="form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <CellsTitle>请认真填写你的信息资料</CellsTitle>
            <Form>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[0].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" ref={this.props.data[0].name}
                    placeholder={`请输入${this.props.data[0].content}`}
                  />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[1].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input type="text" ref={this.props.data[1].name}
                    placeholder={`请输入${this.props.data[1].content}`}
                  />
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>性别</Label>
                <CellBody>
                  <Select ref="sex">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </Select>
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>类别</Label>
                <CellBody>
                  <Select ref="type">
                    <option value="文科">文科</option>
                    <option value="理科">理科</option>
                    <option value="艺体">艺体</option>
                  </Select>
                </CellBody>
              </FormCell>
              {
                this.props.data.map((item, i) => {
                  if (i !== 0 && i !== 1) {
                    return (
                      <FormCell key={i}>
                        <CellHeader>
                          <Label>{item.content}</Label>
                        </CellHeader>
                        <CellBody>
                          <Input type="text" ref={item.name}
                            placeholder={`请输入${item.content}`}
                          />
                        </CellBody>
                      </FormCell>
                    );
                  }
                  return null;
                })
              }
              <ButtonArea direction="vertical">
                <button type="submit" className="weui_btn weui_btn_primary">确定</button>
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
