/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditCareer from './EditCareer';
import { addCareer, deleteCareer,
  initCareerHistory } from '../../../actions/acceptors/career';

export default {
  path: '/acceptors/edit-career/:id',
  async action({ params, context }) {
    const { id } = params;
    const { dispatch } = context.store;
    const props = {
      add: career => dispatch(addCareer(id, career)),
      remove: career => dispatch(deleteCareer(id, career)),
      init: () => dispatch(initCareerHistory(id)),
    };
    return <EditCareer {...props} />;
  },
};
