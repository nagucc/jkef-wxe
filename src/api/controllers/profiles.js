/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED } from 'nagu-validates';

import { profileMiddlewares } from '../../config';
import { getUserId } from 'wxe-auth-express';

const router = new Router();
const findOneProfile = profileMiddlewares.findOne(
  req => ({ userid: req.user.userid }),
  (profile, req, res) => {
    if (profile) {
      res.send({
        ret: SUCCESS,
        data: profile,
      });
    } else {
      res.send({
        ret: OBJECT_IS_NOT_FOUND,
      });
    }
  }
);

router.get('/me',
  getUserId(),
  findOneProfile);
export default router;
