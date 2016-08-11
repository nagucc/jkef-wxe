/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED } from 'nagu-validates';

import { profileMiddlewares, wxapi, host } from '../../config';
import { getUserId } from 'wxe-auth-express';
import { ObjectId } from 'mongodb';
import { add } from '../models/zxj-apply';

const router = new Router();

router.get('/jsconfig', (req, res) => {
  var param = {
    debug:false,
    jsApiList: ['uploadImage', 'chooseImage', 'previewImage'],
    url: `http://${host}/acceptors/zxj-apply`,
  };
  wxapi.getJsConfig(param, (err, data) => {
    if (err) {
      res.send({ ret: SERVER_FAILED, msg: err });
    } else {
      res.send({ ret: SUCCESS, data });
    }
  });
});

const getProfileById = profileMiddlewares.get(
  req => (new ObjectId(req.params.id)),
  (profile, req, res, next) => {
    if (profile) {
      res.profile = profile;
      next();
    } else {
      res.send({
        ret: OBJECT_IS_NOT_FOUND,
        msg: '给定的Id没有找到Profile',
      });
    }
  }
);

// 通过mediaId从微信获取图片Buffer对象
const getImage = mediaId =>
  new Promise(async (resolve, reject) => {
    if (!mediaId) {
      reject('mediaId is invalid');
      return;
    }
    wxapi.getMedia(mediaId, (err, image) => {
      if (err) reject(err);
      else resolve(image);
    });
  });

const putApply = async (req, res, next) => {
  // console.log(req.body);
  const { idCardPhotoId, stuCardPhotoIds, scorePhotoIds } = req.body;
  const fetchIdCardPhoto = getImage(idCardPhotoId);
  const fetchStuCardPhotoes = Promise.all(stuCardPhotoIds.map(photoId =>
    getImage(photoId)));
  const fetchScorePhotoes = Promise.all(scorePhotoIds.map(photoId =>
    getImage(photoId)));
  Promise.all([
    fetchIdCardPhoto,
    fetchStuCardPhotoes,
    fetchScorePhotoes,
  ]).then(photoes => {
    add({
      acceptorId: res.profile._id,
      ...req.body,
      idCardPhoto: photoes[0],
      stuCardPhotoes: photoes[1],
      scorePhotoes: photoes[2],
    }).then(() => res.send({ ret: 0 }),
        err => res.send({ ret: SERVER_FAILED, msg: err }));
  }, err => res.send({ ret: SERVER_FAILED, msg: err }));
};


router.put('/:id',
  getUserId(),
  getProfileById,
  putApply);
export default router;
