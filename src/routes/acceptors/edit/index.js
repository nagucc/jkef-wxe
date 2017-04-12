import React from 'react';
import Edit from './Edit';
import fetch from '../../../core/fetch';

export default {

  path: '/edit/:id',

  async action({ params }) { // eslint-disable-line react/prop-types
    const { id } = params;
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
      fetchById,
      acceptorId: id,
    };
    return {
      component: (<Edit {...props} />),
      title: '修改成员信息',
    };
  },

};
