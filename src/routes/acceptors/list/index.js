import React from 'react';
import ListAcceptors from './ListAcceptors';

export default {

  path: '/list',

  async action({ query }) { // eslint-disable-line react/prop-types
    return <ListAcceptors query={{
      text: '',
      ...query,
    }}
    />;
  },
};
