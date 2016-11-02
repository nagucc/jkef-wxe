/* eslint-disable max-len */
/* jscs:disable maximumLineLength */
import { MongoProfileMiddlewares, MongoProfile } from 'nagu-profile';

import { writeData as gsWriteData } from './gridstore';
import EntityManager from './entity';
import AcceptorManager from 'jkef-model';
import { AcceptorMiddlewares, StatMiddlewares } from 'acceptor-middlewares';

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `wx.nagu.cc:${port}`;

export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const analytics = {

  // https://analytics.google.com/
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },

};

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

export const profileManager = new EntityManager(profileCollection, mongoUrl);

export const profileManager2 = new MongoProfile(mongoUrl, profileCollection);

export const acceptorManager = new AcceptorManager(mongoUrl, 'acceptors');

export const acceptorMiddlewares = new AcceptorMiddlewares(mongoUrl, 'acceptors');

export const statMiddlewares = new StatMiddlewares(mongoUrl, 'acceptors');

// 用于受赠者统计的cron字符串,默认为2分钟统计一次。
export const statCron = process.env.ACCEPTORS_STAT_CRON || '00 */2 * * * *';
