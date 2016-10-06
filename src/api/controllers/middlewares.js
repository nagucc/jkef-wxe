import { manageDpt, supervisorDpt, mongoUrl, profileCollection, acceptorManager } from '../../config';
import { UNKNOWN_ERROR, SERVER_FAILED, UNAUTHORIZED } from 'nagu-validates';
import { MongoProfile } from 'nagu-profile';

const profileDao = new MongoProfile(mongoUrl, profileCollection);

export const isManager = departments => departments.some(dept => dept === manageDpt);

export const isSupervisor = departments =>
  departments.some(dept => dept === supervisorDpt) || isManager(departments);

  // 用于替换微信端获取身份信息，提高速度
export const getUser = async (req, res, next) => {
  try {
    const profile = await profileDao.getByUserId(req.user.userid);
    if (profile && profile.roles)
      req.user.department = profile.roles;
    else req.user.department = [];
    next();
  } catch (e) {
    res.send({
      ret: SERVER_FAILED,
      msg: e,
    });
  }
};

export const getProfileByUserId = (
  getUserId = req => req.user.userid,
  success = (profile, req, res, next) => {
    if (profile) {
      req.user = profile; // eslint-disable-line no-param-reassign
    }
    if (profile && profile.roles) {
      req.user.department = profile.roles; // eslint-disable-line no-param-reassign
    } else {
      req.user.department = []; // eslint-disable-line no-param-reassign
    }
    next();
  }, error = (msg, req, res) => res.send({ ret: SERVER_FAILED, msg })) =>
  async (req, res, next) => {
    console.log('start to getProfileByUserId');
    try {
      const userid = await getUserId(req, res);
      console.log('userid: ', userid);
      const profile = await profileDao.getByUserId(userid);
      success(profile, req, res, next);
    } catch (e) {
      error(e, req, res);
    }
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
  const doc = await acceptorManager.findByIdCardNumber(number);
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

export const isNullOrEmpty = param => (
  isUndefined(param) || param === 'null' || param === ''
);

// 只有管理员和观察员可以继续做next
export const onlyManagerOrSupervisorCanDoNext = (getRoles,
  success = (req, res, next) => next(),
  fail = (req, res) => res.send({ ret: UNAUTHORIZED, msg: '没有权限' }),
  error = (msg, req, res) => res.send({ ret: SERVER_FAILED, msg })) =>
  async (req, res, next) => {
    try {
      const roles = await getRoles(req, res);
      if (isSupervisor(roles) || isManager(roles)) {
        await success(req, res, next);
      } else {
        await fail(req, res, next);
      }
    } catch (e) {
      error(e, req, res, next);
    }
  };

/*
默认的处理错误的方法：将错误信息发送回客户端
 */
export const handleServerFailed = res =>
  msg => res.send({ ret: SERVER_FAILED, msg });
