import React from 'react';
import RegistrationForm from './RegistrationForm';

export default {

  path: '/cee-result-registration',

  async action() {
    return (
      <RegistrationForm />
      );
  },
};
