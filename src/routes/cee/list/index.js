import React from 'react';
import List from './List';

export default {

  path: '/list',

  async action() {
    return <List />;
  },
};
