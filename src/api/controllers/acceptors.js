/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';
import { findAcceptors, addAcceptor,
  findByIdCardNumber, findById, update,
  addEdu, removeEdu,
  addCareer, removeCareer,
  addRecord, removeRecord } from '../models/data-access';

import { getUserId } from 'wxe-auth-express';
import { ensureAcceptorCanBeAdded,
  isManager, isSupervisor, isUndefined,
  getUser, getProfileByUserId } from './middlewares';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED } from '../../err-codes';
import { profileMiddlewares as profile } from '../../config';


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
    const data = await findAcceptors({
      project,
      year,
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

/*
添加受赠者。
任何用户可自助申请成为受赠者，管理员则可以任意添加受赠者，并指定关联企业号账户。
 */
export const add = async (req, res) => {
  const { _id, name, isMale, phone, idCard } = req.body;
  try {
    // 3.0 检查是否有相同的idCard.number存在
    const doc = await findByIdCardNumber(idCard.number);
    if (doc) {
      res.send({ ret: -1, msg: `证件号码'${idCard.number}'已存在。` });
    }

    // 3.0-1 关联企业号账户
    let { userid } = req.body;
    // 3.0-1.1 如果当前用户不是管理员，只能关联自己的企业号账户，忽略body.userid参数
    if (!isManager(req.user.department)) {
      userid = req.user.userid;
    }
    // 3.1. 保存数据到数据库中
    await addAcceptor({ _id, name, isMale, phone, idCard, userid });
    // 3.2 返回结果
    res.send({ ret: SUCCESS, data: {
      name, isMale, phone, idCard, userid, _id,
    } });
  } catch (e) {
    res.send({ ret: SERVER_FAILED, msg: e });
  }
};


router.put('/add',
  getUserId(),
  getUser,
  ensureAcceptorCanBeAdded,
  addProfile,
  add,
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


export const getDetail = (getId = req => (new ObjectId(req.params.id)),
  canUserRead = (req, res) => { // eslint-disable-line arrow-body-style
    return isSupervisor(req.user.department)
      || res.profile.userid === req.user.userid;
  }) =>
  async (req, res) => {
    try {
      const id = getId(req, res);
      const data = await findById(id);
      if (!data) {
        res.send({ ret: OBJECT_IS_NOT_FOUND, msg: '给定的Id不存在' });
        return;
      }
      // 普通成员只能看自己的数据
      if (canUserRead(req, res)) {
        res.send({
          ret: SUCCESS,
          data: {
            ...data,
            ...res.profile,
          },
        });
      } else res.send({ ret: UNAUTHORIZED, msg: '无权查看' });
    } catch (e) {
      res.send({
        ret: SERVER_FAILED,
        msg: e,
      });
    }
  };

router.get('/detail/:id',
  getUserId(),
  getUser,
  getProfile,
  getDetail(req => (new ObjectId(req.params.id))));

export const onlyManagerAndOwnerCanDoNext = idGetter =>
  async (req, res, next = emptyFunction) => {
    const id = idGetter(req, res);
    try {
      const data = await findById(id);
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
    const { name, year } = req.body;
    if (!name
      || !year
      || isNaN(parseInt(year, 10))) {
      res.send({ ret: -1, msg: '必须提供学校名称和入学年份，入学年份必须是数字' });
      return;
    }
    try {
      const _id = getId(req, res);
      await addEdu(_id, {
        name,
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
      await removeEdu(_id, {
        name,
        year: parseInt(year, 10),
      });
      res.send({ ret: 0 });
    } catch (e) {
      // console.log('eeee:', e);
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
      await addCareer(_id, {
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
      await removeCareer(_id, {
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
  if (isUndefined(date)) date = Date.now();
  else date = Date.parse(date);
  const _id = new ObjectId();
  try {
    await addRecord(new ObjectId(id), {
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
    await removeRecord(new ObjectId(id), new ObjectId(recordId));
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
      const doc = await update(_id, req.body);
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
