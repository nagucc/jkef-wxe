/*
eslint-disable import/extensions, import/no-unresolved, no-param-reassign, no-shadow
 */
import { SERVER_FAILED, OBJECT_IS_UNDEFINED_OR_NULL, OBJECT_IS_NOT_FOUND } from 'nagu-validates';
import * as model from '../models/cachedAcceptors';
import * as model2 from '../models/acceptors';
import { error } from '../../config';

// 通过Id获取数据的中间件
export const getById = options => async (req, res, next) => {
  let { getId, success, fail } = options || {};

    // 定义如何获取数据的_id
  getId = getId || (() => req.params.id);
    // 定义获取数据之后如何操作，默认为返回成功代码及数据
  success = success || ((data, req, res, next) => {
    res.data = data;
    next();
  });
    // 定义获取数据失败时如何操作，默认为返回失败代码及描述
  fail = fail || ((e, req, res) => res.send(e));

  try {
    const id = getId(req, res);
    if (!id) {
      error('getById中间件错误：', '无法获取id');
      fail({ ret: OBJECT_IS_UNDEFINED_OR_NULL, msg: '必须提供id' }, req, res, next);
      return;
    }
    const data = await model.getById(id);
    if (!data) {
      error('getById中间件错误:', '无法根据Id获取对象');
      fail({ ret: OBJECT_IS_NOT_FOUND, msg: '对象不存在' }, req, res, next);
      return;
    }
    success(data, req, res, next);
  } catch (e) {
    fail({
      ret: SERVER_FAILED,
      msg: e,
    }, req, res, next);
  }
};

// 获取Acceptor列表
export const list = options => async (req, res, next) => {
  let { getPageIndex, getPageSize, success, fail } = options || {};

    // 定义如何获取pageIndex
  getPageIndex = getPageIndex || (() => req.params.pageIndex);

  // 定义如何获取pageSize
  getPageSize = getPageSize || (() => req.body.pageSize);

  // 定义获取数据之后如何操作，默认为返回成功代码及数据
  success = success || ((data, req, res, next) => {
    res.data = data;
    next();
  });
    // 定义获取数据失败时如何操作，默认为返回失败代码及描述
  fail = fail || ((e, req, res) => res.send(e));

  try {
    const pageIndex = getPageIndex(req, res);
    const pageSize = getPageSize(req, res);

    const data = await model2.list(pageIndex, pageSize);
    success(data, req, res, next);
  } catch (e) {
    error('acceptor.list中间件错误', e.message);
    fail({
      ret: SERVER_FAILED,
      msg: e,
    }, req, res, next);
  }
};
