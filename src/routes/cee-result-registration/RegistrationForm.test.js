import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RegistrationForm from './RegistrationForm';

describe('cee-result-registration', () => {
  it('信息页面检测', () => {
    const wrapper = shallow(<RegistrationForm />);
    expect(wrapper.find('Input')).to.have.length(7);
    expect(wrapper.find('.infoForm')).to.have.length(1);
    // expect(wrapper.containsAllMatchingElements(
    //   <label>姓名</label>
    // )).to.equal(true);
  });
});
