import { Router } from 'express';
import { statMiddlewares } from '../../config';
import { SUCCESS } from 'nagu-validates';

const router = new Router();

router.get('/by-project',
  statMiddlewares.getStatByProject(
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

router.get('/by-year',
  statMiddlewares.getStatByYear(
    (data, req, res) => res.send({ ret: SUCCESS, data }),
  ),
);

export default router;
