/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */
/* jscs:disable maximumLineLength */
import { MongoProfileMiddlewares, MongoProfile } from 'nagu-profile';
import AcceptorManager from 'jkef-model';
import debug from 'debug';
import { AcceptorMiddlewares, StatMiddlewares } from 'acceptor-middlewares';
import { writeData as gsWriteData } from './gridstore';
import EntityManager from './entity';
export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `wx.nagu.cc:${port}`;

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },
  // 微信企业号
  wxent: {
    corpId: process.env.WXE_CORPID,
    secret: process.env.WXE_SECRET,
    agentId: process.env.WXE_AGENTID || 28,
  },
};

export const error = debug('jkef-wxe:error');
export const info = debug('jkef-wxe:info');

// Mongodb 数据库服务器Url
export const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/jkef';

export const profileCollection = process.env.PROFILE_COLLECTION || 'profiles';

export const redisConfig = {
  host: process.env.HOST_REDIS || 'localhost',
  port: process.env.PORT_REDIS || 6379,
};

export const wxentConfig = {
  corpId: process.env.WXE_CORPID,
  secret: process.env.WXE_SECRET,
  angetId: process.env.WXE_AGENTID || 5,
};

export const manageDpt = parseInt(process.env.MANAGER_DEPT || '13', 10);
export const supervisorDpt = parseInt(process.env.SUPERVISOR_DEPT || '14', 10);

export const showLog = Boolean(process.env.SHOW_LOG) || true;

export const profileMiddlewares = new MongoProfileMiddlewares(mongoUrl, profileCollection);

export const writeData = async (data, filename = null, options = {}) => {
  try {
    return await gsWriteData(mongoUrl, data, filename, options);
  } catch (e) {
    throw e;
  }
};

export const zxjApplyManager = new EntityManager('zxjApply', mongoUrl);


export const profileManager = new MongoProfile(mongoUrl, profileCollection);

export const acceptorManager = new AcceptorManager(mongoUrl, 'acceptors');

export const acceptorMiddlewares = new AcceptorMiddlewares(mongoUrl, 'acceptors');

export const statMiddlewares = new StatMiddlewares(mongoUrl, 'acceptors');

// 用于受赠者统计的cron字符串,默认为2分钟统计一次。
export const statCron = process.env.ACCEPTORS_STAT_CRON || '00 */2 * * * *';
