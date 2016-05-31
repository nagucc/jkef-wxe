import React from 'react';
import ListAcceptors from './ListAcceptors';
import { fetchAcceptors, cleanAcceptors } from '../../actions/list-acceptors';
import fetch from '../../core/fetch';

export default {

  path: '/acceptors/list',

  async action({ query, context }) { // eslint-disable-line react/prop-types
    const { dispatch } = context.store;
    const qs = Object.assign({}, {
      pageIndex: 0,
      pageSize: 20,
    }, query);
    dispatch(cleanAcceptors());
    dispatch(fetchAcceptors(query));

    const getMe = async () => {
      try {
        const res = await fetch('/api/wxe-auth/me', {
          credentials: 'same-origin',
        });
        return await res.json();
      } catch (e) {
        // 其他错误
        return { ret: 999, msg: e };
      }
    };
    const props = {
      fetchAcceptors,
      cleanAcceptors,
      getMe,
      query: qs,
    };
    return <ListAcceptors {...props} />;
  },
};
