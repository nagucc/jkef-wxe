import { ADDED_ACCEPTOR_EDU,
  DELETED_ACCEPTOR_EDU,
  INIT_ACCEPTOR_EDU_HISTORY,
  FETCH_FAILED } from '../../constants';

export const addedEdu = edu => ({
  type: ADDED_ACCEPTOR_EDU,
  edu,
});

export const deletedEdu = edu => ({
  type: DELETED_ACCEPTOR_EDU,
  edu,
});

export const initedEduHistory = eduHistory => ({
  type: INIT_ACCEPTOR_EDU_HISTORY,
  eduHistory,
});

export const fetchFailed = error => ({
  type: FETCH_FAILED,
  error,
});
