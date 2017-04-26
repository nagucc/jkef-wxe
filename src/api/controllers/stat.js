import { Router } from 'express';
import * as statMiddlewares from '../middlewares/stat';
import { SUCCESS } from 'nagu-validates';

const router = new Router();

router.get('/by-project',
  statMiddlewares.getStatByProject(),
  (req, res) => res.send({ ret: SUCCESS, data: res.data }),
);

router.get('/by-year',
  statMiddlewares.getStatByYear(),
  (req, res) => res.send({ ret: SUCCESS, data: res.data }),
);

export default router;
