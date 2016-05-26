import { Router } from 'express';
import { findAcceptors } from '../models/data-access';

const router = new Router();

router.get('/list/:pageIndex', async(req, res) => {
  const { pageIndex } = req.params;
  const { project, year, text, pageSize } = req.query;
  try {
    const data = await findAcceptors({
      project,
      year,
      text,
      limit: parseInt(pageSize) || 20,
      skip: (parseInt(pageSize) || 20) * pageIndex,
    });
    res.send({ ret: 0, data });
  } catch (e) {
    res.send({ ret: -1, msg: e });
  }
});

export default router;
