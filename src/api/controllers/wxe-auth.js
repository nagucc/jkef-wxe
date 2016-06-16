import { Router } from 'express';
import api from 'wxent-api-redis';
import { signin, getme, getUserId, getUser } from 'wxe-auth-express';
import { wxentConfig as wxcfg, redisConfig as redis,
  host, manageDpt, supervisorDpt } from '../../config';

const router = new Router();
const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) console.log('目前处于测试状态'); // eslint-disable-line no-console
router.get('/', signin({
  wxapi,
  callbackUrl: `http://${DEBUG ? 'wx.nagu.cc:3001' : host}/api/wxe-auth/`,
}));

// 获取当前登录用户信息
router.get('/me', getme());

router.get('/me/roles',
  getUserId(),
  getUser({ wxapi }),
  (req, res) => {
    const { department } = req.user;
    if (!department) {
      res.send({ ret: -1, msg: req.user.errmsg });
      return;
    }
    const isSupervisor = department.some(dept => dept === supervisorDpt);
    const isManager = department.some(dept => dept === manageDpt);
    res.send({
      ret: 0,
      data: { isSupervisor, isManager },
    });
  });

export default router;
