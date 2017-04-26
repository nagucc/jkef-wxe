/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditCareer from './EditCareer';
import { addCareer, deleteCareer,
  initCareerHistory } from '../../../actions/acceptors/career';

export default {
  path: '/edit-career/:id',
  async action({ params, store }) {
    const { id } = params;
    const { dispatch } = store;
    const props = {
      add: career => dispatch(addCareer(id, career)),
      remove: career => dispatch(deleteCareer(id, career)),
      init: () => dispatch(initCareerHistory(id)),
      acceptorId: id,
    };
    return {
      component: (<EditCareer {...props} />),
      title: '编辑工作经历',
    };
  },
};
