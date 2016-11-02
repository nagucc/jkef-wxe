/*
eslint-disable no-console, no-param-reassign
 */

import { Router } from 'express';
import api from 'wxent-api-redis';
import { signin, getme, getUserId } from 'wxe-auth-express';
import { wxentConfig as wxcfg, redisConfig as redis,
  host, profileMiddlewares, supervisorDpt, manageDpt } from '../../config';
import { SUCCESS } from 'nagu-validates';

const router = new Router();
const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) console.log('目前处于测试状态');

router.get('/',
  signin({
    wxapi,
    callbackUrl: `http://${DEBUG ? 'wx.nagu.cc:3001' : host}/api/wxe-auth/`,
  }));

// 获取当前登录用户信息
router.get('/me', getme());

router.get('/me/roles',
  getUserId(),
  // 判断当前用户是否是Supervisor
  profileMiddlewares.isSupervisor(
    req => req.user.userid,
    supervisorDpt,
    (isSupervisor, req, res, next) => {
      res.roles = { isSupervisor };
      next();
    },
  ),
  // 判断当前用户是否是Manager
  profileMiddlewares.isManager(
    req => req.user.userid,
    manageDpt,
    (isManager, req, res, next) => {
      res.roles = { ...res.roles, isManager };
      next();
    },
  ),
  // 返回结果
  (req, res) => res.send({ ret: SUCCESS, data: res.roles }),
);

export default router;
