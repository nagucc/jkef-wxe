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
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '186244551745631',
    secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },

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


export const profileManager = new MongoProfile(mongoUrl, profileCollection);

export const acceptorManager = new AcceptorManager(mongoUrl, 'acceptors');

export const acceptorMiddlewares = new AcceptorMiddlewares(mongoUrl, 'acceptors');

export const statMiddlewares = new StatMiddlewares(mongoUrl, 'acceptors');

// 用于受赠者统计的cron字符串,默认为2分钟统计一次。
export const statCron = process.env.ACCEPTORS_STAT_CRON || '00 */2 * * * *';
