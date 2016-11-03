
import React from 'react';
import App from '../components/App';

// Child routes
import error from './error';
import ceeResultRegistration from './cee-result-registration';
import acceptors from './acceptors';
import stat from './stat';
import cee from './cee';
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    acceptors,
    ceeResultRegistration,
    stat,
    ceeResultRegistration,
    require('./home').default,
    require('./contact').default,
    require('./login').default,
    require('./register').default,
    require('./admin').default,

    // place new routes before...
    require('./content').default,
    require('./notFound').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - www.reactstarterkit.com`;
    route.description = route.description || '';

    return route;
  },

};
