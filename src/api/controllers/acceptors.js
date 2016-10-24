/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';

import { getUserId } from 'wxe-auth-express';
import { isUndefined, getUser } from './middlewares';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED,
  OBJECT_ALREADY_EXISTS } from 'nagu-validates';
import { profileMiddlewares as profile, acceptorManager,
  manageDpt, supervisorDpt } from '../../config';
import { insert, getById, findOneByIdCardNumber, listByRecord,
  updateById, addEdu, removeEdu,
  addCareer, removeCareer } from './acceptor-middlewares';

const tryRun = func => {
  try {
    return func();
  } catch (e) {
    return null;
  }
};

const router = new Router();

router.get('/list/:pageIndex',
  getUserId(),
  // 判断是否是Supervisor或Manager，只有这两种角色可以查看列表
  profile.isSupervisorOrManager(
    req => req.user.userid,
    manageDpt,
    supervisorDpt,
    (isSupervisorOrManager, req, res, next) => {
      if (isSupervisorOrManager) next();
      else res.send({ ret: UNAUTHORIZED });
    },
  ),
  // 获取数据
  listByRecord(
    req => ({
      ...req.query,
      pageIndex: parseInt(req.params.pageIndex, 10),
      pageSize: parseInt(req.query.pageSize, 10),
    }),
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

router.put('/add',
  getUserId(),
  // 检查证件号码是否已在
  findOneByIdCardNumber(
    req => req.body.idCard ? req.body.idCard.number : null,
    (acceptor, req, res, next) => {
      if (acceptor) {
        res.send({
          ret: OBJECT_ALREADY_EXISTS,
          msg: `证件号码为${acceptor.idCard.number}的数据已存在`,
        });
      } else next();
    }
  ),
  // 检查当前用户是否是管理员，以确定userid的值
  profile.isManager(
    req => req.user.userid,
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
    req => {
      // 只需要添加以下字段，其他字段忽略。
      const { name, isMale, phone, userid } = req.body;
      return {
        name, phone, userid,
        isMale: isMale === 'true',
        isAcceptor: true,
      };
    },
    (prof, req, res, next) => {
      req.profile = prof;
      next();
    }
  ),
  // 在acceptor中添加数据
  insert(
    // acceptor中的数据包括idCard和profile中的所有字段
    req => ({ idCard: req.body.idCard, ...req.profile }),
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

router.get('/detail/:id',
  getUserId(),
  // 判断用户是否具有查看权限。拥有者、管理者可以查看
  profile.isOwnerOrSupervisorOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.user.userid,
    manageDpt,
    supervisorDpt,
    (result, req, res, next) => {
      if (result) next();
      else res.send({ ret: UNAUTHORIZED });
    },
  ),
  getById(
    req => (new ObjectId(req.params.id)),
  ),
);

export const onlyManagerAndOwnerCanDoNext = idGetter =>
  async (req, res, next = emptyFunction) => {
    const id = idGetter(req, res);
    try {
      const data = await acceptorManager.findById(id);
      if (!isManager(req.user.department)
        && req.user.userid !== data.userid) {
        res.send({ ret: 401, msg: '无权操作' });
        return;
      }
      next();
    } catch (e) {
      res.send({ ret: -1, msg: e });
    }
  };

router.put('/edu/:id',
  getUserId(),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.user.userid,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
   addEdu(
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
  getUserId(),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.user.userid,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  removeEdu(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.put('/career/:id',
  getUserId(),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.user.userid,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  addCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

router.delete('/career/:id',
  getUserId(),
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.user.userid,
    manageDpt,
    (isOwnerOrManager, req, res, next) =>
      isOwnerOrManager ? next() : res.send({ ret: UNAUTHORIZED }),
  ),
  removeCareer(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => tryRun(() => ({
      name: req.body.name,
      year: parseInt(req.body.year, 10),
    })),
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);

export const onlyManagerCanDoNext = (req, res, next) => {
  if (isManager(req.user.department)) next();
};

export const putRecord = async (req, res) => {
  const id = req.params.id;
  if (isUndefined(id)) {
    res.send({
      ret: OBJECT_IS_NOT_FOUND,
      msg: '所给的Id不正确',
    });
    return;
  }
  const { project, amount, recommander, remark } = req.body;
  let { date } = req.body;
  console.log('Date Req: ', date);
  if (isUndefined(date)) date = Date.now();
  else date = new Date(date);
  const _id = new ObjectId();
  try {
    await acceptorManager.addRecord(new ObjectId(id), {
      project, date, amount, recommander, remark,
      _id,
    });
    res.send({
      ret: SUCCESS,
      data: {
        _id,
        project,
        date,
        amount,
        recommander,
        remark,
      },
    });
  } catch (e) {
    res.send({
      ret: UNKNOWN_ERROR,
      msg: e,
    });
  }
};

router.put('/record/:id',
  getUserId(),
  getUser,
  onlyManagerCanDoNext,
  putRecord,
);

export const deleteRecord = async (req, res) => {
  const { id, recordId } = req.params;
  if (isUndefined(id) || isUndefined(recordId)) {
    res.send({
      ret: OBJECT_IS_NOT_FOUND,
      msg: '所给的Id不正确',
    });
    return;
  }
  let result = { ret: SUCCESS };
  try {
    await acceptorManager.removeRecord(new ObjectId(id), new ObjectId(recordId));
  } catch (e) {
    result = {
      ret: UNKNOWN_ERROR,
      msg: e,
    };
  }
  res.send(result);
};
router.delete('/record/:id/:recordId',
  getUserId(),
  getUser,
  onlyManagerCanDoNext,
  deleteRecord
);

export const postUpdate = (getId = req => new ObjectId(req.params.id)) =>
  async (req, res) => {
    const _id = getId(req, res);
    try {
      const doc = await acceptorManager.updateById({ ...req.body, _id });
      if (doc.result.nModified > 0) {
        res.send({
          ret: SUCCESS,
          data: { _id },
        });
      } else {
        res.send({
          ret: OBJECT_IS_NOT_FOUND,
          msg: `给定的id(${_id})没找到`,
        });
      }
    } catch (e) {
      res.send({ ret: SERVER_FAILED, msg: e });
    }
  };

router.post('/:id',
  getUserId(),
  // 只有拥有者或Manager才能执行更新
  profile.isOwnerOrManager(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.user.userid,
    manageDpt,
    (isOwnerOrManager, req, res, next) => {
      if (isOwnerOrManager) next();
      else res.send({ ret: UNAUTHORIZED });
    }
  ),
  // 只有Manager才能更新userid和name字段
  profile.isManager(
    req => req.user.userid,
    manageDpt,
    (isManager, req, res, next) => {
      if(!isManager) {
        delete req.body.userid;
        delete req.body.name;
      }
      next();
    },
  ),
  // 执行更新操作
  updateById(
    req => tryRun(() => new ObjectId(req.params.id)),
    req => req.body,
    (result, req, res) => res.send({ ret: SUCCESS }),
  ),
);
export default router;
