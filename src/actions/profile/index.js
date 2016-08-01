import { FETCHED_MY_PROFILE } from '../../constants';

export const fetchedMyProfile = profile => ({
  type: FETCHED_MY_PROFILE,
  profile,
});
