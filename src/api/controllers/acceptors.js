/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';

import { getUserId } from 'wxe-auth-express';
import { ensureAcceptorCanBeAdded,
  isManager, isSupervisor, isUndefined,
  getUser, getProfileByUserId } from './middlewares';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED } from '../../err-codes';
import { profileMiddlewares as profile, acceptorManager } from '../../config';
import { insert, getById } from './acceptor-middlewares';

const addProfile = profile.add(req => {
  const { name, isMale, phone } = req.body;
  return {
    name, phone,
    isMale: isMale === 'true',
    isAcceptor: true,
  };
});
const getProfile = profile.get(req => (new ObjectId(req.params.id)));
const updateProfile = profile.update(req => (new ObjectId(req.params.id)), req => {
  const { name, isMale, phone } = req.body;
  let userid = req.body.userid;
  if (!isManager(req.user.department)) userid = req.user.userid;
  return { name, isMale, phone, userid };
});

const router = new Router();


export const list = async (req, res) => {
  const { pageIndex } = req.params;
  const { year, text, pageSize, project } = req.query;
  // 只有Supervisor或Manager可以查看列表
  if (!isSupervisor(req.user.department)
    && !isManager(req.user.department)) {
    res.send({ ret: UNAUTHORIZED, msg: '您不能查看受赠者列表' });
    return;
  }
  try {
    const data = await acceptorManager.listByRecord({
      project,
      year: parseInt(year, 10),
      text,
      limit: parseInt(pageSize, 10) || 20,
      skip: (parseInt(pageSize, 10) || 20) * pageIndex,
    });
    res.send({ ret: 0, data });
  } catch (e) {
    res.send({ ret: SERVER_FAILED, msg: e });
  }
};
router.get('/list/:pageIndex',
  getUserId(),
  // getUser,
  getProfileByUserId(),
  list);

router.put('/add',
  getUserId(),
  getUser,
  ensureAcceptorCanBeAdded,
  addProfile,
  insert(),
);

export const ensureIdIsCorrect = (req, res, next) => {
  const id = req.params.id;
  if (!id || id === 'undefined') {
    res.send({
      ret: OBJECT_IS_NOT_FOUND,
      msg: '所给Id不正确',
    });
  } else next();
};

router.get('/detail/:id',
  getUserId(),
  getUser,
  getProfile,
  getById(req => (new ObjectId(req.params.id)),
    (acceptor, req, res) => (
      isSupervisor(req.user.department)
        || res.profile.userid === req.user.userid
    )
  ));

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

export const putEdu = (getId = req => (new ObjectId(req.params.id))) =>
  async (req, res) => {
    const { name, year, degree } = req.body;
    if (!name
      || !year
      || !degree
      || isNaN(parseInt(year, 10))) {
      res.send({ ret: -1, msg: '必须提供学校名称、层次和入学年份，入学年份必须是数字' });
      return;
    }
    try {
      const _id = getId(req, res);
      await acceptorManager.addEdu(_id, {
        name, degree,
        year: parseInt(year, 10),
      });
      res.send({ ret: 0 });
    } catch (e) {
      res.send({ ret: -1, msg: e });
    }
  };
router.put('/edu/:id',
  getUserId(),
  getUser,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  putEdu(),
);

export const deleteEdu = (getId = req => (new ObjectId(req.params.id))) =>
  async (req, res) => {
    const { name, year } = req.body;
    if (!name
      || !year
      || isNaN(parseInt(year, 10))) {
      res.send({ ret: -1, msg: '必须提供学校名称和入学年份，入学年份必须是数字' });
      return;
    }
    try {
      const _id = getId(req, res);
      await acceptorManager.removeEdu(_id, {
        name,
        year: parseInt(year, 10),
      });
      res.send({ ret: 0 });
    } catch (e) {
      res.send({ ret: -1, msg: e });
    }
  };

router.delete('/edu/:id',
  getUserId(),
  getUser,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  deleteEdu(),
);

export const putCareer = (getId = req => (new ObjectId(req.params.id))) =>
  async (req, res) => {
    const { name, year } = req.body;
    if (!name
      || !year
      || isNaN(parseInt(year, 10))) {
      res.send({ ret: -1, msg: '必须提供公司名称和入职年份，入职年份必须是数字' });
      return;
    }
    try {
      const _id = getId(req, res);
      await acceptorManager.addCareer(_id, {
        name,
        year: parseInt(year, 10),
      });
      res.send({ ret: 0 });
    } catch (e) {
      res.send({ ret: -1, msg: e });
    }
  };

router.put('/career/:id',
getUserId(),
getUser,
onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
putCareer(),
);

export const deleteCareer = (getId = req => (new ObjectId(req.params.id))) =>
  async (req, res) => {
    const { name, year } = req.body;
    if (!name
      || !year
      || isNaN(parseInt(year, 10))) {
      res.send({ ret: -1, msg: '必须提供公司名称和入职年份，入职年份必须是数字' });
      return;
    }
    try {
      const _id = getId(req, res);
      await acceptorManager.removeCareer(_id, {
        name,
        year: parseInt(year, 10),
      });
      res.send({ ret: 0 });
    } catch (e) {
      res.send({ ret: -1, msg: e });
    }
  };

router.delete('/career/:id',
  getUserId(),
  getUser,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  deleteCareer(),
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
  getUser,
  ensureAcceptorCanBeAdded,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  ensureIdIsCorrect,
  updateProfile,
  postUpdate());
export default router;
