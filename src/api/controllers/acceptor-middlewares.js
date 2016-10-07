/*
eslint-disable no-param-reassign
 */

import emptyFunction from 'fbjs/lib/emptyFunction';
import { ObjectId } from 'mongodb';
import { SUCCESS, UNAUTHORIZED, UNKNOWN_ERROR,
  OBJECT_IS_NOT_FOUND, SERVER_FAILED } from '../../err-codes';
import { acceptorManager } from '../../config';

// 插入数据的中间件
export const insert = (
  // 定义如何获取待插入的数据，此数据必须包括"idCard.number"。默认取req.body
  getData = req => req.body,
  // 定义插入数据失败时如何操作，默认为返回失败代码及描述
  fail = (e, req, res) => res.send(e),
  // 定义插入数据之后如何操作，默认为返回成功代码及数据（包括_id字段）
  success = (data, req, res) => res.send({ ret: SUCCESS, data })) =>
  async (req, res, next) => {
    try {
      const acceptor = getData(req, res);
      const { _id, idCard: { number } } = acceptor;
      // 0 检查是否有相同的idCard.number存在
      const doc = await acceptorManager.findOneByIdCardNumber(number);
      if (doc) {
        fail({ ret: -1, msg: `证件号码'${number}'已存在。` }, req, res, next);
      }
      // 1. 保存数据到数据库中
      const insertedId = await acceptorManager.insert(acceptor);
      // 2 返回结果
      success({
        ...acceptor,
        _id: _id || insertedId,
      }, req, res, next);
    } catch (e) {
      fail({ ret: SERVER_FAILED, msg: e }, req, res, next);
    }
  };

// 通过Id获取数据的中间件
export const getById = (
  // 定义如何获取数据的_id，默认使用url中的:id参数
  getId = req => (new ObjectId(req.params.id)),
  // 检查获取到的数据是否可以返回，默认都可以返回
  canRetrived = () => true,
  // 定义获取数据失败时如何操作，默认为返回失败代码及描述
  fail = (e, req, res) => res.send(e),
  // 定义获取数据之后如何操作，默认为返回成功代码及数据
  success = (data, req, res) => res.send({ ret: SUCCESS, data })) =>
  async (req, res, next) => {
    try {
      const id = getId(req, res);
      const data = await acceptorManager.findById(id);
      if (!data) {
        fail({ ret: OBJECT_IS_NOT_FOUND, msg: '对象不存在' }, req, res, next);
        return;
      }
      // 判断数据是否可被返回
      if (canRetrived(data, req, res)) {
        success(data, req, res, next);
      } else fail({ ret: UNAUTHORIZED, msg: '无权查看' }, req, res, next);
    } catch (e) {
      fail({
        ret: SERVER_FAILED,
        msg: e,
      }, req, res, next);
    }
  };
