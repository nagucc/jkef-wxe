import React from 'react';
import StatByProject from './StatByProject';

export default {

  path: '/by-project',

  async action() {
    return {
      component: <StatByProject />,
      title: '按项目统计',
    };
  },

};
