/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditRecord from './EditRecord';

export default {
  path: '/edit-record/:id',
  async action({ params }) {
    return <EditRecord acceptorId={params.id} />;
  },
};
