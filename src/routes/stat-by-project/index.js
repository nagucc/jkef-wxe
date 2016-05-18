import React from 'react';
import StatByProject from './StatByProject';
import {getStatByProject} from './fetch-data';

export default {

  path: '/stat-by-project',

  async action() {

    let stat = await getStatByProject();
    let totalAmount = 0;
    stat.forEach(item => totalAmount += item.value.amount);
    let props = {stat, totalAmount};
    return <StatByProject {...props}/>;
  },

};
