/*

EntityManager 类，用于生成一个通用的管理Entity的类。
 */

import { useCollection } from 'mongo-use-collection';
// import { ObjectId } from 'mongodb';

let useEntity;
export default class EntityManager {
  /**
   * 构造函数
   * @param  {String} collectionName Entity使用的集合的名称
   * @param  {String} mongoUrl       所使用的数据库的连接字符串
   */
  constructor(collectionName, mongoUrl) {
    this.collectionName = collectionName;
    this.mongoUrl = mongoUrl;
    useEntity = cb => useCollection(mongoUrl, collectionName, cb);
  }

  /**
   *
   * 插入实体对象到数据库中
   * @param  {Object} entityData 实体对象数据
   * @return {Promise}            操作结果
   */
  insert(entityData) {
    return new Promise((resolve, reject) => useEntity(async col => {
      let result;
      try {
        result = await col.insertOne(entityData);
        resolve(result);
      } catch (e) {
        console.log('EntityManager Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }

/**
 * 查询实体对象
 * @param  {Object} query =             {}  查询条件
 * @param  {Number} limit =             100 查询结果限制
 * @param  {number} skip  =             0   跳过开头的结果
 * @return {Promise}       操作结果
 */
  find(query = {}, limit = 100, skip = 0) {
    console.log('[EntityManager find]query::', query);
    return new Promise((resolve, reject) => useEntity(async col => {
      let result;
      try {
        const cursor = col.find(query).skip(skip).limit(limit);
        result = await cursor.toArray();
        console.log('[EntityManager count]result.length::', result.length);
        resolve(result);
      } catch (e) {
        console.log('[EntityManager find]Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }

  count(query = {}) {
    console.log('[EntityManager count]query::', query);
    return new Promise((resolve, reject) => useEntity(async col => {
      try {
        const result = await col.count(query);
        console.log('[EntityManager count]result::', result);
        resolve(result);
      } catch (e) {
        console.log('[EntityManager count]Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }
}
