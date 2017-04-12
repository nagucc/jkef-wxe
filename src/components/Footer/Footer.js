import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <div className="weui-footer" style={{ marginTop: '10px' }}>
        <p className="weui-footer__links">
          <a href="http://jkef.nagu.cc" className="weui-footer__link">家琨教育基金会</a>
        </p>
        <p className="weui-footer__text">Copyright © 2006-{(new Date()).getFullYear()} 云南大学</p>
      </div>
    );
  }
}

export default Footer;
