import React, {PropTypes} from 'react';

var RegistrationForm = React.createClass({
  render: function () {
    return (
      <div>
        <div className="hd">
          <h1 className="page_title">学生信息</h1>
        </div>
        <div className="bd">
          <FormList data={this.props.data}/>
        </div >
      </div>  
    )
  }
});

var FormList = React.createClass({
  render: function () {
    var formNodes = this.props.data.map(function (structure) {
      return (
        <FormInput key={structure.id} name={structure.name} content={structure.content}/>
      );
    });
    return (
      <form className="formList infoForm" role="form" action="/api/fundinfo" method="post">
        <div className="weui_cells_title">请认真填写你的信息资料</div>
        <div className="weui_cells weui_cells_form">
          <div className="weui_cell">
            <div className="weui_cell_hd">
              <label className="weui_label">性别</label>
            </div>
            <div className="weui_cell_bd weui_cell_primary">
              <input type="radio" name="sex" value="男"/>
              <label>男</label>
              <input type="radio" name="sex" value="女"/>
              <label>女</label>
            </div>
          </div>
          <div className="weui_cell">
            <div className="weui_cell_hd">
              <label className="weui_label">类别</label>
            </div>
            <div className="weui_cell_bd weui_cell_primary">
              <input type="radio" name="type" value="文"/>
              <label>文</label>
              <input type="radio" name="type" value="理"/>
              <label>理</label>
              <input type="radio" name="type" value="艺体"/>
              <label>艺体</label>
            </div>
          </div>
          {formNodes}
          <FormButton />
        </div>
      </form>
    );
  }
});

var FormInput = React.createClass({
  render: function () {
    return (
      <div className="formInput weui_cell">
        <div className="weui_cell_hd">
          <label className="weui_label">{this.props.content}</label>
        </div>
        <div className="weui_cell_bd weui_cell_primary">
          <input className="weui_input" name={this.props.name} type="text" placeholder={"请输入"+this.props.content}/>
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
});

export default RegistrationForm;
