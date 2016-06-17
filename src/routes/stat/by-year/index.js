import React from 'react';
import StatByYear from './StatByYear';

export default {

  path: '/by-year',

  async action() {
    return <StatByYear />;
  },
};
