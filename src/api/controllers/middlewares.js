import { findByIdCardNumber } from '../models/data-access';
import { manageDpt, supervisorDpt } from '../../config';
import profileDao from '../models/wxe-profile';
import { UNKNOWN_ERROR } from 'nagu-validates';


export const isManager = departments => departments.some(dept => dept === manageDpt);

export const isSupervisor = departments =>
  departments.some(dept => dept === supervisorDpt) || isManager(departments);

  // 用于替换微信端获取身份信息，提高速度
export const getUser = async (req, res, next) => {
  const profile = await profileDao.getByUserId(req.user.userid);
  req.user.department = profile.roles;
  next();
};

/*
检查Acceptor数据是否可以被添加或更新
主要是检查必须的数据字段是否存在
 */
export const ensureAcceptorCanBeAdded = async (req, res, next) => {
  const { name, idCard } = req.body;
  // 2. 姓名、手机号、证件信息均不能为空
  if (!name || !idCard || !idCard.type || !idCard.number) {
    res.send({
      ret: UNKNOWN_ERROR,
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

export const isUndefined = param => (
  param === undefined || param === 'undefined'
);
