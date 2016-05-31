import { Router } from 'express';
import { findAcceptors, addAcceptor, findAcceptor } from '../models/data-access';
import { wxentConfig as wxcfg,
  redisConfig as redis,
  manageDpt, supervisorDpt } from '../../config';
import api from 'wxent-api-redis';
import { getUser, getUserId } from 'wxe-auth-express';

const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);
const router = new Router();

const isSupervisor = departments => {
  const depts = [
    parseInt(manageDpt, 10),
    parseInt(supervisorDpt, 10),
  ];
  return departments.some(dept => depts.some(dept2 => dept2 === dept));
};

const isManager = departments => {
  const managerDept = parseInt(manageDpt, 10);
  return departments.some(dept => dept === managerDept);
};

router.get('/list/:pageIndex',
  getUserId(),
  getUser({ wxapi }),
  async (req, res) => {
    const { pageIndex } = req.params;
    let { project } = req.query;
    const { year, text, pageSize } = req.query;

    // 判断是否正确取到用户数据
    // 若出现错误，则返回
    if (req.user.errcode !== 0) {
      res.send({ ret: req.user.errcode, msg: req.user.errmsg });
      return;
    }
    const { department } = req.user;
    // 如果用户不在管理组中，且project参数为'助学金'或空，则返回错误
    if (!isSupervisor(department)) {
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
  });

/*
添加受赠者。
任何用户可自助申请成为受赠者，管理员则可以任意添加受赠者，并指定关联企业号账户。
 */
router.put('/add',
  getUserId(),
  getUser({ wxapi }),
  async (req, res) => {
    // 1. 如果当前用户未登录，返回错误代码
    if (req.user.errcode !== 0) {
      res.send({ ret: -1, msg: req.user.errmsg });
      return;
    }
    const { name, isMale, phone, idCard } = req.body;
    // 2. 姓名、手机号、证件信息均不能为空
    if (!name || !phone || !idCard.type || !idCard.number) {
      res.send({
        ret: -1,
        msg: '姓名、手机号、证件信息均不能为空',
      });
      return;
    }
    // 3. 数据准备完成，将数据保存到数据库中，并关联企业号账户
    try {
      // 3.0 检查是否有相同的idCard.number存在
      const doc = await findAcceptor(idCard.number);
      if (doc) {
        res.send({ ret: -1, msg: `证件号码'${idCard.number}'已存在。` });
      }
      // 3.1. 保存数据到数据库中
      const acceptor = await addAcceptor({ name, isMale, phone, idCard });
      // 3.2. 关联企业号账户
      let { userid } = req.body;
      // 3.2.1 如果当前用户不是管理员，只能关联自己的企业号账户
      if (!isManager(req.user.department)) {
        userid = req.user.userid;
      }
      // 3.2.2 更新企业号账户信息
      if (userid) {
        wxapi.updateUser({
          userid,
          extattr: {
            attrs: [{ name: '受赠者Id', value: acceptor._id }],
          },
        }, (err, result) => {
          if (err || result.errcode !== 0) {
            res.send({ ret: -1, msg: err || result });
          } else {
            res.send({ ret: 0, data: acceptor });
          }
        });
      } else res.send({ ret: 0, data: acceptor });
    } catch (e) {
      res.send({ ret: -1, msg: e });
    }
  }
);
export default router;
