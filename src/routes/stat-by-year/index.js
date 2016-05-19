import React from 'react';
import StatByYear from './StatByYear';
import {getStatByYear} from '../fetch-data';

export default {

  path: '/stat-by-year',

  async action() {

    let stat = await getStatByYear();
    let totalAmount = 0, totalCount = 0, lastUpdated = 0;
    stat.forEach(item => {
      totalAmount += item.value.amount;
      totalCount += item.value.count;
      lastUpdated = Math.max(lastUpdated, isNaN(item.value.lastUpdated)?0:item.value.lastUpdated)
    });
    let props = {stat, totalAmount, totalCount, lastUpdated};
    return <StatByYear {...props}/>;
  },
};
