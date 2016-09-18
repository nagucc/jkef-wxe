import React from 'react';
import Registration from './Registration';
import fetch from '../../../core/fetch';

export default {

  path: '/ngv',

  async action() {
    // 提交到服务器进行注册的方法
    const action = async data => {
      let result;
      try {
        const res = await fetch('/api/acceptors/add-ngv', {
          credentials: 'same-origin',
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        result = await res.json();
      } catch (e) {
        // 其他错误
        return Promise.reject({ ret: 999, msg: e });
      }
      if (result.ret === 0) return Promise.resolve(result.data);
      return Promise.reject(result);
    };
    const props = {
      action,
      defaultTitle: '志愿者登记',
    };
    return <Registration {...props} />;
  },

};