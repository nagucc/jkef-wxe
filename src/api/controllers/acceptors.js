import { Router } from 'express';
import { findAcceptors } from '../models/data-access';
import { wxentConfig as wxcfg, redisConfig as redis, manageDpt } from '../../config';
import api from 'wxent-api-redis';
import { getUser, getUserId } from 'wxe-auth-express';

const wxapi = api(wxcfg.corpId, wxcfg.secret, wxcfg.agentId, redis.host, redis.port);
const router = new Router();

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
    if (!department.includes(parseInt(manageDpt, 10))) {
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

export default router;
