/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditRecord from './EditRecord';

export default {
  path: '/edit-record/:id',
  async action({ params }) {
    return {
      component: (<EditRecord acceptorId={params.id} />),
      title: '编辑奖助记录',
    };
  },
};
