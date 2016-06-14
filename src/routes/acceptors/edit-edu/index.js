/*
eslint-disable react/prop-types
 */

import React from 'react';
import EditEdu from './EditEdu';
import fetch from '../../../core/fetch';
import { addedEdu, deletedEdu,
  initedEduHistory, fetchFailed } from '../../../actions/acceptors/edu';
// import { unauthorized } from '../../../actions/wxe-auth';

export default {
  path: '/acceptors/edit-edu/:id',
  async action({ params, context }) {
    const { id } = params;
    const { dispatch } = context.store;
    const props = {};
    props.addEdu = async (edu) => {
      try {
        const res = await fetch(`/api/acceptors/edu/${id}`, {
          credentials: 'same-origin',
          method: 'PUT',
          body: JSON.stringify(edu),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const result = await res.json();
        if (result.ret === 0) dispatch(addedEdu(edu));
        else dispatch(fetchFailed(result));
      } catch (e) {
        dispatch(fetchFailed({ ret: -1, msg: e }));
      }
    };
    props.deleteEdu = async (edu) => {
      try {
        const res = await fetch(`/api/acceptors/edu/${id}`, {
          credentials: 'same-origin',
          method: 'DELETE',
          body: JSON.stringify(edu),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const result = await res.json();
        if (result.ret === 0) dispatch(deletedEdu(edu));
        else dispatch(fetchFailed(result));
      } catch (e) {
        dispatch(fetchFailed({ ret: -1, msg: e }));
      }
    };

    props.initEduHistory = async () => {
      try {
        const res = await fetch(`/api/acceptors/detail/${id}`, {
          credentials: 'same-origin',
        });
        const result = await res.json();
        if (result.ret === 0) dispatch(initedEduHistory(result.data));
        else dispatch(fetchFailed(result));
      } catch (e) {
        dispatch(fetchFailed({ ret: -1, msg: e }));
      }
    };

    return <EditEdu {...props} />;
  },
};
