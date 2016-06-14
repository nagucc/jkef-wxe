/*
eslint-disable
*/

import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { EditEduComponent as EditEdu } from './EditEdu';
import emptyFunction from 'fbjs/lib/emptyFunction';
// import App from '../../../components/App';

describe('acceptors/edit-edu', () => {

  it('发生错误时，显示错误信息', () => {
    const wrapper = shallow(
      <EditEdu err={{ msg: 'test' }} />
    );
    expect(wrapper.find('.weui_msg_desc')).to.have.lengthOf(1);
  });
});
