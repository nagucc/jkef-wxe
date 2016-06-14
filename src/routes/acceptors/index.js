/*
通过一个文件引入所有route
 */

import registration from './registration';
import detail from './detail';
import edit from './edit';
import editEdu from './edit-edu';
import editCareer from './edit-career';

export default [
  registration,
  detail,
  edit,
  editEdu,
  editCareer,
];
