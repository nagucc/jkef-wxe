/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditEdu from './EditEdu';
import { addEdu, deleteEdu,
  initEduHistory } from '../../../actions/acceptors/edu';
import { timeout, reset } from '../../../actions/common';

export default {
  path: '/acceptors/edit-edu/:id',
  async action({ params, context }) {
    const { id } = params;
    const { dispatch } = context.store;
    const props = {
      addEdu: edu => dispatch(addEdu(id, edu)),
      deleteEdu: edu => dispatch(deleteEdu(id, edu)),
      initEduHistory: () => dispatch(initEduHistory(id)),
    };
    return <EditEdu {...props} />;
  },
};
