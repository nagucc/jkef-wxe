import React from 'react';
import StatByProject from './StatByProject';
import {getStatByProject} from '../fetch-data';

export default {

  path: '/stat-by-project',

  async action() {

    let stat = await getStatByProject();
    let totalAmount = 0, totalCount = 0, lastUpdated = 0;
    stat.forEach(item => {
      totalAmount += item.value.amount;
      totalCount += item.value.count;
      lastUpdated = Math.max(lastUpdated, isNaN(item.value.lastUpdated)?0:item.value.lastUpdated)
    });
    let props = {stat, totalAmount, totalCount, lastUpdated};
    return <StatByProject {...props}/>;
  },

};
