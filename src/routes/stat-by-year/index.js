import React from 'react';
import StatByYear from './StatByYear';

export default {

  path: '/stat-by-year',

  async action() {
    return <StatByYear />;
  },
};
