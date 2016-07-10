/*
eslint-disable no-param-reassign
 */
import { SERVER_FAILED,
  OBJECT_IS_UNDEFINED_OR_NULL } from 'nagu-validates';

import * as dao from './wxe-profile';


/*
添加Profile
 */
export const add = composeProfile =>
  async (req, res, next) => {
    try {
      const profile = composeProfile(req, res);
      if (!profile.name) {
        res.send({
          ret: OBJECT_IS_UNDEFINED_OR_NULL,
          msg: '姓名不能为空',
        });
        return;
      }
      const result = await dao.add(profile);
      req.body._id = result.insertedId;
      next();
    } catch (e) {
      res.send({
        ret: SERVER_FAILED,
        msg: e,
      });
    }
  };

export const get = getId =>
  async (req, res, next) => {
    try {
      const _id = getId(req, res);
      const doc = await dao.get(_id);
      res.profile = doc;
      next();
    } catch (e) {
      res.send({
        ret: SERVER_FAILED,
        msg: e,
      });
    }
  };

export const update = (getId, composeProfile) =>
  async (req, res, next) => {
    const _id = getId(req, res);
    const profile = composeProfile(req, res);
    try {
      await dao.update(_id, profile);
      next();
    } catch (e) {
      res.send({
        ret: SERVER_FAILED,
        msg: e,
      });
    }
  };
