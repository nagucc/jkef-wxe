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

// rest api
router.get('/api/fundinfo/:id', (req, res) => {
  FundInfo.find({ id: req.params.id }, (err, info) => {
    if (err) return res.send(500, 'Error occurred:database error.');
    res.json(info);
  });
});
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
        res.json(info2);
      });
    } else {
      return res.status(500).send('Error occurred:database has existed.');
    }
  });
  // }else {
  //     res.redirect(303,'/thank-you');
  // }
});

export default router;
