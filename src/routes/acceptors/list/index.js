import React from 'react';
import ListAcceptors from './ListAcceptors';
import { fetchAcceptors } from '../../../actions/acceptors/list';
import { reset } from '../../../actions/common';

// import fetch from '../../../core/fetch';

export default {

  path: '/acceptors/list',

  async action({ query, context }) { // eslint-disable-line react/prop-types
    const { dispatch } = context.store;
    const qs = Object.assign({ text: '' }, {
      pageIndex: 0,
      pageSize: 20,
    }, query);
    dispatch(reset());
    dispatch(fetchAcceptors(query));

    const props = {
      fetchAcceptors,
      cleanAcceptors: reset,
      query: qs,
    };
    return <ListAcceptors {...props} />;
  },
};
