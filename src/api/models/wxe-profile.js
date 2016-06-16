/*
根据微信企业号的userid记录用户的相关信息
 */

import { useCollection } from 'mongo-use-collection';
import { mongoUrl } from '../../config';

const PROFILE_COLLECTION = 'profiles';

class WxeProfle {
  constructor(url, collection = 'wxe_profles') {
    this.useProfiles = cb => useCollection(url, collection, cb);
  }
  add(profile = {}) {
    if (!profile.userid) return Promise.reject('必须有userid');
    return new Promise((resolve, reject) =>
      this.useProfiles(async col => {
        try {
          const result = await col.updateOne({ userid: profile.userid }, {
            $set: profile,
          }, { upsert: true });
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }));
  }
  getByUserId(userid) {
    return new Promise((resolve, reject) =>
      this.useProfiles(async col => {
        try {
          const doc = await col.findOne({ userid });
          resolve(doc);
        } catch (e) {
          reject(e);
        }
      }));
  }
  update(profile = {}) {
    const { userid, ...rest } = profile;
    return new Promise((resolve, reject) =>
      this.useProfiles(async col => {
        try {
          const oldDoc = await this.getByUserId(userid);
          const doc = {
            ...oldDoc,
            ...rest,
          };
          await col.updateOne({ userid }, { $set: doc });
          resolve(doc);
        } catch (e) {
          reject(e);
        }
      }));
  }
  remove(userid) {
    return new Promise((resolve, reject) =>
      this.useProfiles(async col => {
        try {
          const result = await col.remove({ userid });
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }));
  }
 }

const dao = new WxeProfle(mongoUrl, PROFILE_COLLECTION);
export default dao;
