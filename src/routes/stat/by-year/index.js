import React from 'react';
import StatByYear from './StatByYear';

export default {

  path: '/by-year',

  async action() {
    return {
      component: <StatByYear />,
      title: '按年度统计',
    };
  },
};
