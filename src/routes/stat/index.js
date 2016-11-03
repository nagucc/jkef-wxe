import byYear from './by-year';
import byProject from './by-project';

export default {
  path: '/stat',
  children: [
    byProject,
    byYear,
  ],
  async action({ next }) {
    const component = await next();
    return { component };
  },
};
