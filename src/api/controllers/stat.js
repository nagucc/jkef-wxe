import { Router } from 'express';
import {getStatByProject} from '../models/data-access';

const router = new Router();

router.get('/by-project', async(req, res) => {
  try{
    res.send({ret: 0, data: await getStatByProject()});
  } catch(e) {
    res.send({ret: -1, msg: e});
  }
});

export default router;
