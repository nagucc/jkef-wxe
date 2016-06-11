import React from 'react';
import StatByProject from './StatByProject';
import { getStatByProject } from '../fetch-data';

export default {

  path: '/stat-by-project',

  async action() {
    const stat = await getStatByProject();
    let totalAmount = 0;
    let totalCount = 0;
    let lastUpdated = 0;
    let maxAmount = 0;
    stat.forEach(item => {
      totalAmount += item.value.amount;
      totalCount += item.value.count;
      lastUpdated = Math.max(lastUpdated,
        isNaN(item.value.lastUpdated) ? 0 : item.value.lastUpdated);
      maxAmount = Math.max(maxAmount, item.value.amount);
    });
    const props = { stat, totalAmount, totalCount, lastUpdated, maxAmount };
    return <StatByProject {...props} />;
  },

};
