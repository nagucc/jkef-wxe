/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditEdu from './EditEdu';

export default {
  path: '/edit-edu/:id',
  async action({ params }) {
    const { id } = params;
    const props = {
      acceptorId: id,
    };
    return {
      component: (<EditEdu {...props} />),
      title: '编辑教育经历',
    };
  },
};
