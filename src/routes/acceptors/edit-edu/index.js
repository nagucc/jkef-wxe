import React from 'react';
import EditEdu from './EditEdu';

export default {
  path: '/acceptors/edit-edu/:id',
  async action({ params }) { // eslint-disable-line react/prop-types
    const { id } = params;
    return <EditEdu />;
  },
};
