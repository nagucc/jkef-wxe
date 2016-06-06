import React from 'react';
import RegistrationForm from './RegistrationForm';

let structure = [
  {
    content: '姓名',
    name: 'name',
  },
  {
    content: '身份证',
    name: 'id',
  },
  {
    content: '毕业学校',
    name: 'graduation',
  },
  {
    content: '高考分数',
    name: 'grade',
  },
  {
    content: '录取学校',
    name: 'university',
  },
  {
    content: '录取专业',
    name: 'major',
  },
  {
    content: '录取层次',
    name: 'degree',
  },
];

export default {

  path: '/cee-result-registration',

  async action() {
    return <RegistrationForm data={structure} />;
  },
};
