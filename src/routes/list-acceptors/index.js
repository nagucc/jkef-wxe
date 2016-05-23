import React from 'react';
import StatByProject from './StatByProject';
import {getStatByProject} from '../fetch-data';

export default {

  path: '/acceptors/list',

  async action() {

    return <StatByProject {...props}/>;
  },

};
