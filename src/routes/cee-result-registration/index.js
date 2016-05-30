import React from 'react';
import RegistrationForm from './RegistrationForm';

var structure = [
    {
      "id": 1,
      "content": "姓名",
      "name": "name"
    },
    {
      "id": 2,
      "content": "身份证",
      "name": "id"
    },
    {
      "id": 3,
      "content": "毕业学校",
      "name": "graduation"
    },
    {
      "id": 4,
      "content": "高考分数",
      "name": "grade"
    },
    {
      "id": 5,
      "content": "录取学校",
      "name": "university"
    },
    {
      "id": 6,
      "content": "录取专业",
      "name": "major"
    },
    {
      "id": 7,
      "content": "录取层次",
      "name": "degree"
    }
  ];

export default {

  path: '/cee-result-registration',

  async action() {
    return <RegistrationForm data={structure}/>;
  },
};
