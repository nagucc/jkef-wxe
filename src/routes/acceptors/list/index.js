import React from 'react';
import ListAcceptors from './ListAcceptors';

export default {

  path: '/list',

  async action({ query }) { // eslint-disable-line react/prop-types
    const component = (<ListAcceptors
      query={{
        text: '',
        ...query,
      }}
    />);
    return {
      component,
      title: '受赠者列表',
    };
  },
};
