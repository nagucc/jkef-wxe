import React from 'react';
import Detail from './Detail';
import { fetchAcceptor } from '../../../actions/acceptors/detail';

export default {
  path: '/acceptors/detail/:id',
  async action({ params, context }) { // eslint-disable-line react/prop-types
    const { id } = params;
    const { dispatch } = context.store;
    dispatch(fetchAcceptor(id));
    return <Detail />;
  },
};
