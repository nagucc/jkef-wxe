
import React from 'react';
import App from '../components/App';

// Child routes
import error from './error';
// import ceeResultRegistration from './cee-result-registration';
import acceptors from './acceptors';
import stat from './stat';
// import cee from './cee';
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    acceptors,
    stat,
    // ceeResultRegistration,
    require('./home').default,

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./notFound').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },

};
