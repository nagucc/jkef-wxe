/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';
import expressJwt from 'express-jwt';
import * as auth from 'wxe-auth-express';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
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
  // acceptorMiddlewares.listByRecord(
  //   req => ({
  //     ...req.query,
  //     pageIndex: parseInt(req.params.pageIndex, 10),
  //     pageSize: parseInt(req.query.pageSize, 10),
  //   }),
  //   (data, req, res) => res.send({ ret: SUCCESS, data }),
  // ),
);

router.put('/add',
  // 确保用户已登录
  expressJwt({
    secret: auth2.jwt.secret,
    credentialsRequired: true,
    getToken: wxeAuth.getToken,
  }),
  // 检查证件号码是否已在
  acceptorMiddlewares.findOneByIdCardNumber(
    req => req.body.idCard ? req.body.idCard.number : null,
    (acceptor, req, res, next) => {
      if (acceptor) {
        res.send({
          ret: OBJECT_ALREADY_EXISTS,
          msg: `证件号码为${acceptor.idCard.number}的数据已存在`,
        });
      } else next();
    },
  ),
  // 检查当前用户是否是管理员，以确定userid的值
  profile.isManager(
    getId,
    manageDpt,
    (isManager, req, res, next) => {
      if (!isManager) {
        req.body.userid = req.user.userid; // 如果用户不是管理员，则只能取当前用户自己的userid
      }
      next();
    },
  ),
  // 在profile中添加数据
  profile.add(
    (req) => {
      // 只需要添加以下字段，其他字段忽略。
      const { name, isMale, phone, userid } = req.body;
      return {
        name,
        phone,
        userid,
        isMale: isMale === 'true',
        isAcceptor: true,
      };
    },
    (prof, req, res, next) => {
      req.profile = prof;
      next();
    },
  ),
  // 在acceptor中添加数据
  acceptorMiddlewares.insert(
    // acceptor中的数据包括idCard和profile中的所有字段
    req => ({ idCard: req.body.idCard, ...req.profile }),
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
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
  auth.getUserId(),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
 acceptorMiddlewares.addEdu(
   req => tryRun(() => new ObjectId(req.params.id)),
   req => tryRun(() => ({
     name: req.body.name,
     year: parseInt(req.body.year, 10),
     degree: req.body.degree,
   })),
   (result, req, res) => res.send({ ret: SUCCESS }),
 ),
);

router.delete('/edu/:id',
  auth.getUserId(),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    getId,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  acceptorMiddlewares.removeEdu(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
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
