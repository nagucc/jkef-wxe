/*
eslint-disable no-param-reassign
 */

import { Router } from 'express';

import { getUserId } from 'wxe-auth-express';
import { ensureAcceptorCanBeAdded,
  isManager, isSupervisor, isUndefined,
  getUser, getProfileByUserId } from './middlewares';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED } from '../../err-codes';
import { profileMiddlewares as profile, acceptorManager } from '../../config';

export const insert = (getData = req => req.body,
  fail = (e, req, res) => res.send(e),
  success = (data, req, res) => res.send({ ret: SUCCESS, data })) =>
  async (req, res, next) => {
    try {
      const { _id, idCard: { type, number }, name, isMale, phone } = getData(req, res);
      // 3.0 检查是否有相同的idCard.number存在
      const doc = await acceptorManager.findOneByIdCardNumber(number);
      if (doc) {
        fail({ ret: -1, msg: `证件号码'${number}'已存在。` }, req, res, next);
      }
      // 3.1. 保存数据到数据库中
      const insertedId = await acceptorManager.insert({
        _id,
        idCard: { type, number },
        name, phone, isMale,
      });
      // 3.2 返回结果
      success({
        _id: _id || insertedId,
        idCard: { type, number },
        name, isMale, phone,
      }, req, res, next);
    } catch (e) {
      fail({ ret: SERVER_FAILED, msg: e }, req, res, next);
    }
  };
