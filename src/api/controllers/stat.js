import { Router } from 'express';
import { acceptorManager } from '../../config';

const router = new Router();

router.get('/by-project', async(req, res) => {
  try {
    res.send({ ret: 0, data: await acceptorManager.getStatByProject() });
  } catch (e) {
    res.send({ ret: -1, msg: e });
  }
});

router.get('/by-year', async (req, res) => {
  try {
    res.send({ ret: 0, data: await acceptorManager.getStatByYear() });
  } catch (e) {
    res.send({ ret: -1, msg: e });
  }
});

export default router;
