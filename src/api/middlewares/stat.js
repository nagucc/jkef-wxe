/*
eslint-disable import/extensions, import/no-unresolved, no-param-reassign, no-shadow
 */
import { SERVER_FAILED } from 'nagu-validates';
import * as model from '../models/cachedStat';
import { error } from '../../config';

export const getStatByProject = options =>
async (req, res, next) => {
  let { success, fail } = options;

  // 定义获取数据之后如何操作，默认为返回成功代码及数据
  success = success || ((data, req, res, next) => {
    res.data = data;
    next();
  });

  // 定义获取数据失败时如何操作，默认为返回失败代码及描述
  fail = fail || ((e, req, res) => res.send(e));

  try {
    const data = await model.fetchByProject();
    success(data, res, res, next);
  } catch (e) {
    error('getStatByProject中间件错误:', e.message);
    fail({ ret: SERVER_FAILED, msg: e.message }, req, res, next);
  }
};

export const getStatByYear = options =>
async (req, res, next) => {
  let { success, fail } = options;

  // 定义获取数据之后如何操作，默认为返回成功代码及数据
  success = success || ((data, req, res, next) => {
    res.data = data;
    next();
  });

  // 定义获取数据失败时如何操作，默认为返回失败代码及描述
  fail = fail || ((e, req, res) => res.send(e));

  try {
    const data = await model.fetchByYear();
    success(data, res, res, next);
  } catch (e) {
    error('getStatByYear中间件错误:', e.message);
    fail({ ret: SERVER_FAILED, msg: e.message }, req, res, next);
  }
};
