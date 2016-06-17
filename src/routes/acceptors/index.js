/*
通过一个文件引入所有route
 */

import registration from './registration';
import detail from './detail';
import edit from './edit';
import editEdu from './edit-edu';
import editCareer from './edit-career';
import list from './list';

export default {
  path: '/acceptors',
  children: [
    registration,
    detail,
    edit,
    editEdu,
    editCareer,
    list,
  ],
  async action({ next }) {
    const component = await next();
    return component;
  },
};
