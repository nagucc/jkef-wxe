/*
通过一个文件引入所有route
 */

import registration from './registration';
import detail from './detail';
import edit from './edit';
import editEdu from './edit-edu';
import editCareer from './edit-career';
import list from './list';
import editRecord from './edit-record';
import zxjApply from './zxj-apply';
import zxjApplyList from './zxj-apply-list';
import ngv from './ngv';

export default {
  path: '/acceptors',
  children: [
    registration,
    detail,
    edit,
    editEdu,
    editCareer,
    list,
    editRecord,
    zxjApply,
    zxjApplyList,
    ngv,
  ],
  async action({ next }) {
    const component = await next();
    return component;
  },
};
