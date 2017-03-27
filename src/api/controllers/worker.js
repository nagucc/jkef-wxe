/*
eslint-disable no-console, no-new
 */

import { acceptorManager, statCron, error } from '../../config';
import { CronJob } from 'cron';

try {
  new CronJob(statCron, async () => {
    console.log('@@@@@@@@');
    await acceptorManager.computeStatByProject();
    await acceptorManager.computeStatByYear();
  }, null, true);
} catch (e) {
  error('[STAT CRON JOB ERROR]', e);
}
