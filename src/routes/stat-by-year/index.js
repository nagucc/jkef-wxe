import React from 'react';
import StatByYear from './StatByYear';
import { getStatByYear } from '../fetch-data';

export default {

  path: '/stat-by-year',

  async action() {

    const stat = await getStatByYear();
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
    const props = { stat, totalAmount, totalCount, lastUpdated, maxAmount};
    return <StatByYear {...props} />;
  },
};
