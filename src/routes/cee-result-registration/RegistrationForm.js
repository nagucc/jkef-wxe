import React from 'react';
import {
  Button, ButtonArea, Form, FormCell, Select,
  CellHeader, CellBody, Label, CellsTitle, Input,
} from 'react-weui';
import fetch from '../../core/fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.text();
}

class RegistrationForm extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
  };
  static defaultProps = {
    data: [],
  };
  state = { sex: '男', type: '理科' };
  // trace change about sex type;
  handleChangeSex(e) {
    this.setState({ sex: e.target.value });
  }
  handleChangeType(e) {
    this.setState({ type: e.target.value });
  }
  // fetch handle
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      name: document.getElementById('name').value,
      id: document.getElementById('id').value,
      graduation: document.getElementById('graduation').value,
      grade: document.getElementById('grade').value,
      university: document.getElementById('university').value,
      major: document.getElementById('major').value,
      degree: document.getElementById('degree').value,
    }, () => {
      fetch('/api/fundinfo', {
        credentials: 'include',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          console.log('request succeeded with JSON response', data);
        }).catch((error) => {
          console.log('request failed', error);
        });
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
                  <Input required type="text" id={this.props.data[0].name}
                    placeholder={`请输入${this.props.data[0].content}`}
                  />
                </CellBody>
              </FormCell>
              <FormCell>
                <CellHeader>
                  <Label>{this.props.data[1].content}</Label>
                </CellHeader>
                <CellBody>
                  <Input required type="text" id={this.props.data[1].name}
                    placeholder={`请输入${this.props.data[1].content}`}
                  />
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>性别</Label>
                <CellBody>
                  <Select onChange={this.handleChangeSex.bind(this)}>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </Select>
                </CellBody>
              </FormCell>
              <FormCell select selectPos="after">
                <Label>类别</Label>
                <CellBody>
                  <Select onChange={this.handleChangeType.bind(this)}>
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
                          <Input required id={item.name} type="text"
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
                <Button type="primary">确定</Button>
                <Button type="default">返回</Button>
              </ButtonArea>
            </Form>
          </form>
        </div>
      </div>
    );
  }
}
export default RegistrationForm;
