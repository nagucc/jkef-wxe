import FundInfo from '../../data/models/RegistrationSchema';
import Mongoose from 'mongoose';
import Router from 'express';

const router = new Router();

const opts = {
  server: {
    socketOptions: { keepAlive: 1 },
  },
};
Mongoose.connect('mongodb://localhost/jkef', opts);

const findData = function (item) {
  return new Promise((resolve, reject) => {
    FundInfo.find(item, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
const saveData = function (schema) {
  return new Promise((resolve, reject) => {
    schema.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
// rest api
export const getDetail = async (req, res) => {
  try {
    const data = await findData({ id: req.params.id });
    if (data.length === 0) {
      res.send({ ret: 0, info: '给定的id不存在' });
    } else res.json(data);
  } catch (e) {
    res.send({ ret: -1, info: 'Error occurred:database error.' });
  }
};
router.get('/:id', getDetail);
// router.get('/api/fundinfo/:id', (req, res) => {
//   FundInfo.find({ id: req.params.id }, (err, info) => {
//     if (err) return res.send(500, 'Error occurred:database error.');
//     res.json(info);
//   });
// });

export const postAdd = async (req, res) => {
  try {
    const data = await findData({ id: req.body.id });
    if (data.length === 0 || data[0].id !== req.body.id) {
      const info = new FundInfo({
        name: req.body.name,
        id: req.body.id,
        sex: req.body.sex,
        type: req.body.type,
        graduation: req.body.graduation,
        grade: req.body.grade,
        university: req.body.university,
        major: req.body.major,
        degree: req.body.degree,
      });
      const data1 = await saveData(info);
      res.json(data1);
    } else res.send({ ret: 0, info: 'Error occurred:database has existed.' });
  } catch (e) {
    res.send({ ret: -1, info: 'Error occurred:database error.' });
  }
};

router.post('/', postAdd);

/*
router.post('/', (req, res) => {
  // if(req.xhr || req.accepts('json') ==='json'){
  console.log(req.body);
  FundInfo.findOne({ id: req.body.id }, (err, a) => {
    if (err) {
      return res.status(500).send('Error occurred:database error.');
    } else if (a === null || a.id !== req.body.id) {
      const info = new FundInfo({
        name: req.body.name,
        id: req.body.id,
        sex: req.body.sex,
        type: req.body.type,
        graduation: req.body.graduation,
        grade: req.body.grade,
        university: req.body.university,
        major: req.body.major,
        degree: req.body.degree,
      });
      info.save((err2, info2) => {
        if (err2) return res.status(500).send('Error occurred:database error.');
        console.log(info2);
        res.json(info2);
      });
    } else {
      return res.send('Error occurred:database has existed.');
    }
  });
});
*/

export default router;
