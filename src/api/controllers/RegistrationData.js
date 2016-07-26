import FundInfo from '../../data/models/RegistrationSchema';
import Mongoose from 'mongoose';
import Router from 'express';
import { mongoUrl } from '../../config';
import { list } from '../models/cee-result';

const router = new Router();

router.get('/list', async (req, res) => {
  try {
    const data = await list();
    res.send({ ret: 0, data });
  } catch (e) {
    res.send({ ret: 500, msg: e });
  }
});

const opts = {
  server: {
    socketOptions: { keepAlive: 1 },
  },
};
Mongoose.connect(mongoUrl, opts);

// mongoose find函数的promise对象
const findData = function (item) {
  return new Promise((resolve, reject) => {
    FundInfo.find(item, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
// mongoose save函数的promise对象
const saveData = function (schema) {
  return new Promise((resolve, reject) => {
    schema.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
// 通过id查询数据库信息
export const getDetail = async (req, res) => {
  try {
    const data = await findData({ id: req.params.id });
    // 这里promise返回的data是个数组，所以用长度0来判断。不存在即为0
    if (data.length === 0) {
      res.send({ ret: 0, info: '给定的id不存在' });
    } else res.json(data);
  } catch (e) {
    res.send({ ret: -1, info: 'Error occurred:database error.' });
  }
};
router.get('/:id', getDetail);

// 添加表单信息到数据库。如果id存在返回错误。
export const postAdd = async (req, res) => {
  try {
    const data = await findData({ id: req.body.id });
    if (data.length === 0 || data[0].id !== req.body.id) {
      const info = new FundInfo({
        name: req.body.name,
        id: req.body.id,
        sex: req.body.sex,
        style: req.body.style,
        graduation: req.body.graduation,
        grade: req.body.grade,
        university: req.body.university,
        major: req.body.major,
        degree: req.body.degree,
      });
      await saveData(info);
      res.json({ ret: 1, info: '信息录入成功' });
    } else res.json({ ret: 0, info: '请勿重复提交' });
  } catch (e) {
    res.json({ ret: -1, info: 'Error occurred:database error.' });
  }
};

router.post('/', postAdd);

export default router;
