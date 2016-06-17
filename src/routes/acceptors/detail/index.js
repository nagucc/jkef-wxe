import React from 'react';
import Detail from './Detail';

export default {
  path: '/detail/:id',
  async action({ params }) { // eslint-disable-line react/prop-types
    return <Detail acceptorId={params.id} />;
  },
};
