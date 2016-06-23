import React from 'react';
import Registration from '../registration/Registration';
import fetch from '../../../core/fetch';

export default {

  path: '/edit/:id',

  async action({ params }) { // eslint-disable-line react/prop-types
    const { id } = params;
    // 提交到服务器进行更新的方法
    const action = async data => {
      let result;
      try {
        const res = await fetch(`/api/acceptors/${id}`, {
          credentials: 'same-origin',
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        result = await res.json();
        if (result.ret === 0) return result.data;
        return Promise.reject(result);
      } catch (e) {
        // 其他错误
        return Promise.reject({ ret: 999, msg: e });
      }
    };

    const fetchById = async () => {
      try {
        const res = await fetch(`/api/acceptors/detail/${id}`, {
          credentials: 'same-origin',
        });
        const result = await res.json();
        if (result.ret === 0) return result.data;
        return Promise.reject(result);
      } catch (e) {
        return { ret: -1, msg: 'other error' };
      }
    };


    const props = {
      action,
      fetchById,
    };
    return <Registration {...props} />;
  },

};
