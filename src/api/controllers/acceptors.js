/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';
import expressJwt from 'express-jwt';
import * as auth from 'wxe-auth-express';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED } from 'nagu-validates';
import { profileMiddlewares as profile,
  manageDpt, supervisorDpt, acceptorMiddlewares, auth as auth2 } from '../../config';
import * as wxeAuth from './wxe-auth-middlewares';
import * as acceptorsMiddleware from '../middlewares/acceptors';

const tryRun = (func) => {
  try {
    return func();
  } catch (e) {
    return null;
  }
};

// 获取当前用户的Id
const getId = req => req.user.UserId;

const router = new Router();

router.get('/list/:pageIndex',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),

  // 判断是否是Supervisor或Manager，只有这两种角色可以查看列表
  profile.isSupervisorOrManager(
    getId,
    manageDpt,
    supervisorDpt,
    (isSupervisorOrManager, req, res, next) => {
      if (isSupervisorOrManager) next();
      else res.send({ ret: UNAUTHORIZED });
    },
  ),
  // 获取数据
  acceptorsMiddleware.list(),

  // 返回数据
  (req, res) => res.json({ ret: SUCCESS, data: res.data }),
);

router.put('/add',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  acceptorsMiddleware.add({
    getAcceptor: (req) => {
      // 只需要添加以下字段，其他字段忽略。
      const { name, isMale, phone, userid, idCard } = req.body;
      return {
        name,
        phone,
        userid,
        idCard,
        isMale: isMale === 'true',
        isAcceptor: true,
      };
    },
  }),
  (req, res) => res.json({ ret: SUCCESS, data: res.data }),
);

router.get('/detail/:id',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  // 判断用户是否具有查看权限。拥有者、管理者可以查看
  profile.isOwnerOrSupervisorOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    supervisorDpt,
    (result, req, res, next) => {
      if (result) next();
      else res.send({ ret: UNAUTHORIZED });
    },
  ),
  acceptorsMiddleware.getById(
    req => (new ObjectId(req.params.id)),
  ),
  (req, res) => res.send({ ret: SUCCESS, data: res.data }),
);

router.put('/edu/:id',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      (isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED })),
  ),
 acceptorsMiddleware.addEdu(),
 (req, res) => res.json({ ret: SUCCESS }),
);

router.delete('/edu/:id',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      (isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED })),
  ),
  acceptorsMiddleware.removeEdu(),
  (req, res) => res.json({ ret: SUCCESS }),
);

router.put('/career/:id',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  acceptorMiddlewares.addCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.delete('/career/:id',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  acceptorMiddlewares.removeCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.put('/record/:id',
  auth.getUserId(),
  profile.isManager(
    getId,
    manageDpt,
    (isManager, req, res, next) =>
      isManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  acceptorMiddlewares.addRecord(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      project: req.body.project,
      amount: parseFloat(req.body.amount, 10),
      date: isNaN(Date.parse(req.body.date)) ? new Date() : new Date(req.body.date),
    })),
    (recordId, req, res) => res.send({ ret: SUCCESS, data: recordId }),
  ),
);

router.delete('/record/:id/:recordId',
  auth.getUserId(),
  profile.isManager(
    getId,
    manageDpt,
    (isManager, req, res, next) =>
      isManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  acceptorMiddlewares.removeRecord(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => new ObjectId(req.params.recordId)),
    (recordId, req, res) => res.send({ ret: SUCCESS, data: recordId }),
  ),
);

router.post('/:id',
  // auth.getUserId(),
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  // 只有拥有者或Manager才能执行更新
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) => {
      if (isOwnerOrManager) next();
      else res.send({ ret: UNAUTHORIZED });
    },
  ),
  // 只有Manager才能更新userid和name字段
  profile.isManager(
    getId,
    manageDpt,
    (isManager, req, res, next) => {
      if (!isManager) {
        delete req.body.userid;
        delete req.body.name;
      }
      next();
    },
  ),
  // 执行更新操作
  acceptorMiddlewares.updateById(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.body,
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);
export default router;
