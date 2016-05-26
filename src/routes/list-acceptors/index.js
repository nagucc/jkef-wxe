import React from 'react';
import ListAcceptors from './ListAcceptors';
import { fetchAcceptors, cleanAcceptors } from '../../actions/list-acceptors';

export default {

  path: '/acceptors/list',

  async action({ query, context }) {
    const { dispatch } = context.store;
    const qs = Object.assign({}, {
      pageIndex: 0,
      pageSize: 20,
    }, query);
    dispatch(cleanAcceptors());
    dispatch(fetchAcceptors(query));
    const props = {
      fetchAcceptors,
      cleanAcceptors,
      query: qs,
    };
    return <ListAcceptors {...props} />;
  },
};
