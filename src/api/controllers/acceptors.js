import { Router } from 'express';
import {findAcceptors} from '../models/data-access';

const router = new Router();

router.get('/list/:pageIndex', async(req, res) => {
  let {pageIndex} = req.params;
  let pageSize = 20;
  let {project} = req.query;
  try{
    let data = await findAcceptors({
      project,
      limit: pageSize,
      skip: pageSize*pageIndex
    });
    res.send({ret: 0, data});
  } catch(e) {
    res.send({ret: -1, msg: e});
  }
});

export default router;
