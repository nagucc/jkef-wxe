import React from 'react';
import Registration from './Registration';
import { showRegistration,
  setIdCardTypeGroup,
  setIdCardTypePerson } from '../../../actions/acceptors/registration';
import { setUserRole } from '../../../actions/wxe-auth';
import { getMyRoles } from '../../fetch-data';

export default {

  path: '/acceptors/registration',

  async action({ context }) { // eslint-disable-line react/prop-types
    const { dispatch } = context.store;
    dispatch(showRegistration());
    const props = {
      setIdCardTypePerson,
      setIdCardTypeGroup,
      showRegistration,
      getMyRoles,
      setUserRole,
    };
    return <Registration {...props} />;
  },

};
