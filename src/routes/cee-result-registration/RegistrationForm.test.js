import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RegistrationForm from './RegistrationForm';

describe('cee-result-registration', () => {
  it('信息页面检测', () => {
    const props = [
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
    const wrapper = shallow(<RegistrationForm data={props} />);
    expect(wrapper.find('Input')).to.have.length(props.length);
    expect(wrapper.find(`#${props[0].name}`)).to.have.length(1);
    // expect(wrapper.containsAllMatchingElements(
    //   <label>姓名</label>
    // )).to.equal(true);
  });
});
