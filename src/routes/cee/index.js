/*
通过一个文件引入所有route
 */

import list from './list';

export default {
  path: '/cee',
  children: [
    list,
  ],
  async action({ next }) {
    const component = await next();
    return component;
  },
};
