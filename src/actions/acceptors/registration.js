import { SHOW_ACCEPTORS_REGISTRATION,
  SET_IDCARD_TYPE_PERSON,
  SET_IDCARD_TYPE_GROUP } from '../../constants';


export const showRegistration = acceptor => ({
  type: SHOW_ACCEPTORS_REGISTRATION,
  acceptor,
});

export const setIdCardTypeGroup = () => ({
  type: SET_IDCARD_TYPE_GROUP,
});

export const setIdCardTypePerson = () => ({
  type: SET_IDCARD_TYPE_PERSON,
});
