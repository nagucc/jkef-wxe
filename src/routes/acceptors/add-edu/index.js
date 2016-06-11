import React from 'react';
import AddEdu from './AddEdu';

export default {
  path: '/acceptors/add-edu/:id',
  async action({ params }) { // eslint-disable-line react/prop-types
    const { id } = params;
    return <AddEdu />;
  },
};
