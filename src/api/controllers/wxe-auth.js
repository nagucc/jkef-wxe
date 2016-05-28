import { Router } from 'express';
import api from 'wxent-api-redis';
import { signin, getme } from 'wxe-auth-express';
import { wxentConfig as wxcfg, redisConfig as redis, host } from '../../config';

const router = new Router();
const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);

router.get('/', signin({
  wxapi,
  callbackUrl: `http://wx.nagu.cc:3001/api/wxe-auth/`,
}));

// 获取当前登录用户信息
router.get('/me', getme());

export default router;
