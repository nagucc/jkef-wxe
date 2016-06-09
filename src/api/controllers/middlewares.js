import { Router } from 'express';
import { findAcceptors, addAcceptor,
  findByIdCardNumber, findById, update } from '../models/data-access';
import { wxentConfig as wxcfg,
  redisConfig as redis,
  manageDpt, supervisorDpt } from '../../config';
import api from 'wxent-api-redis';
import { getUser, getUserId } from 'wxe-auth-express';

const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);
const router = new Router();

export const isManager = departments => departments.some(dept => dept === manageDpt);

export const isSupervisor = departments =>
  departments.some(dept => dept === supervisorDpt) || isManager(departments);


/*
检查Acceptor数据是否可以被添加或更新
 */
export const ensureAcceptorCanBeAdded = async (req, res, next) => {
  // 1. 如果当前用户未登录，返回错误代码
  if (req.user.errcode !== 0) {
    res.send({
      ret: req.user.errcode,
      msg: req.user.errmsg,
    });
    return;
  }
  const { name, idCard } = req.body;
  // 2. 姓名、手机号、证件信息均不能为空
  if (!name || !idCard || !idCard.type || !idCard.number) {
    res.send({
      ret: -1,
      msg: '姓名、证件信息均不能为空',
    });
    return;
  }
  next();
};

/*
根据idCardNumber获取数据
 */
export const findAcceptorByIdCardNumber = getNum => async (req, res, next) => {
  const number = getNum(req, res);
  const doc = await findByIdCardNumber(number);
  if (doc) res.acceptor = doc;
};

/*
确保用户已登录
 */
export const ensureUserSignedIn = (req, res, next) => {
  // 判断是否正确取到用户数据
  // 若出现错误，则返回
  if (req.user.errcode !== 0) {
    res.send({ ret: req.user.errcode, msg: req.user.errmsg });
  } else next();
};
