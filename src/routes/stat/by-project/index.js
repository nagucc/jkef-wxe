import React from 'react';
import StatByProject from './StatByProject';

export default {

  path: '/by-project',

  async action() {
    return <StatByProject />;
  },

};
