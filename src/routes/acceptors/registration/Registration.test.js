/*
eslint-disable
*/

import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { RegistrationComponent as Registration } from './Registration';
import App from '../../../components/App';

describe('acceptors/registration', () => {

  it('生成框架', () => {
    const props = {
      ui: {
        cardPanel: {},
        wxePanel: {},
        baseInfoPanel: {},
        isMale: {},
        submitButton: {},
        errorMsg: {},
      },
      fields: {
        idCard: {
          type: ''
        },
      },
    }
    const wrapper = shallow(
      <Registration {...props} />
    );
    expect(wrapper.find('.page_title')).to.have.length(1);
  });

  it('普通用户注册Acceptor', async () => {
    const props = {
      ui: {
        cardPanel: {},
        wxePanel: {},
        baseInfoPanel: {},
        isMale: {},
        submitButton: {},
      },
    }
    // const wrapper = shallow(
    //   <Registration {...props} />
    // );
    // console.log(mount(<Registration {...props} />))
  })
});
