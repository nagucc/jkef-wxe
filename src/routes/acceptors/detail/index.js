import React from 'react';
import Detail from './Detail';
import fetch from '../../../core/fetch';

export default {
  path: '/acceptors/detail/:id',
  async action({ params }) {
    const { id } = params;
    const res = await fetch(`/api/acceptors/detail/${id}`, {
      credentials: 'same-origin',
    });
    const result = await res.json();
    if (result.ret === 0) {
      return <Detail {...result.data} />;
    }
    return <Detail error={result} />;
  },
};
