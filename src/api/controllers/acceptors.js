import { Router } from 'express';
import { findAcceptors, addAcceptor,
  findByIdCardNumber, findById, update,
  addEdu, removeEdu,
  addCareer, removeCareer } from '../models/data-access';
import { wxentConfig as wxcfg,
  redisConfig as redis } from '../../config';
import api from 'wxent-api-redis';
import { getUser, getUserId } from 'wxe-auth-express';
import { ensureAcceptorCanBeAdded,
  isManager, isSupervisor,
  ensureUserSignedIn } from './middlewares';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { ObjectId } from 'mongodb';
import profileDao from '../models/wxe-profile';

const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);
const router = new Router();

const getUser2 = async (req, res, next) => {
  const profile = await profileDao.getByUserId(req.user.userid);
  req.user.department = profile.roles;
  next();
};

export const list = async (req, res) => {
  const { pageIndex } = req.params;
  let { project } = req.query;
  const { year, text, pageSize } = req.query;
  // 如果用户不在管理组中，且project参数为'助学金'或空，则返回错误
  if (!isSupervisor(req.user.department)) {
    if (project === '助学金') {
      res.send({ ret: 401, msg: '您目前不能查看助学金受赠者列表' });
      return;
    } else if (!project) {
      // 当用户不在管理组中，且project为空时，将project设置为'奖学金'
      project = '奖学金';
    }
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
    res.send({ ret: -1, msg: e });
  }
};
router.get('/list/:pageIndex',
  getUserId(),
  // getUser({ wxapi }),
  getUser2,
  // ensureUserSignedIn,
  list);

/*
添加受赠者。
任何用户可自助申请成为受赠者，管理员则可以任意添加受赠者，并指定关联企业号账户。
 */
export const add = async (req, res) => {
  const { name, isMale, phone, idCard } = req.body;
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
    const _id = await addAcceptor({ name, isMale, phone, idCard, userid });
    // 3.2 返回结果
    res.send({ ret: 0, data: {
      name, isMale, phone, idCard, userid, _id,
    } });
  } catch (e) {
    res.send({ ret: -1, msg: e });
  }
};
router.put('/add',
  getUserId(),
  getUser({ wxapi }),
  ensureAcceptorCanBeAdded,
  add,
);

export const getDetail = async (req, res) => {
  try {
    const data = await findById(new ObjectId(req.params.id));
    if (!data) {
      res.send({ ret: -1, msg: '给定的Id不存在' });
    }
    // 普通成员只能看自己的数据
    if (isSupervisor(req.user.department)
      || data.userid === req.user.userid) res.send({ ret: 0, data });
    else res.send({ ret: 401, msg: '无权查看' });
  } catch (e) {
    res.send({
      ret: -1,
      msg: e,
    });
  }
};
router.get('/detail/:id',
  getUserId(),
  getUser({ wxapi }),
  ensureUserSignedIn,
  getDetail);

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


export const putEdu = async (req, res) => {
  const { name, year } = req.body;
  if (!name
    || !year
    || isNaN(parseInt(year, 10))) {
    res.send({ ret: -1, msg: '必须提供学校名称和入学年份，入学年份必须是数字' });
    return;
  }
  try {
    await addEdu(new ObjectId(req.params.id), {
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
  getUser({ wxapi }),
  ensureUserSignedIn,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  putEdu,
);


export const deleteEdu = async (req, res) => {
  const { name, year } = req.body;
  if (!name
    || !year
    || isNaN(parseInt(year, 10))) {
    res.send({ ret: -1, msg: '必须提供学校名称和入学年份，入学年份必须是数字' });
    return;
  }
  try {
    await removeEdu(new ObjectId(req.params.id), {
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
  getUser({ wxapi }),
  ensureUserSignedIn,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  deleteEdu,
);

export const putCareer = async (req, res) => {
  const { name, year } = req.body;
  if (!name
    || !year
    || isNaN(parseInt(year, 10))) {
    res.send({ ret: -1, msg: '必须提供公司名称和入职年份，入职年份必须是数字' });
    return;
  }
  try {
    await addCareer(new ObjectId(req.params.id), {
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
getUser({ wxapi }),
ensureUserSignedIn,
onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
putCareer,
);

export const deleteCareer = async (req, res) => {
  const { name, year } = req.body;
  if (!name
    || !year
    || isNaN(parseInt(year, 10))) {
    res.send({ ret: -1, msg: '必须提供公司名称和入职年份，入职年份必须是数字' });
    return;
  }
  try {
    await removeCareer(new ObjectId(req.params.id), {
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
  getUser({ wxapi }),
  ensureUserSignedIn,
  onlyManagerAndOwnerCanDoNext(req => new ObjectId(req.params.id)),
  deleteCareer,
);

export const postUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findById(id);
    if (!isManager(req.user.department)
      && req.user.userid !== data.userid) {
      res.send({ ret: 401, msg: '无权操作' });
      return;
    }
    await update(id, req.body);
    res.send({
      ret: 0,
      data: { _id: id },
    });
  } catch (e) {
    res.send({ ret: -1, msg: e });
  }
};

router.post('/:id',
  getUserId(),
  getUser({ wxapi }),
  ensureUserSignedIn,
  ensureAcceptorCanBeAdded,
  postUpdate);
export default router;
