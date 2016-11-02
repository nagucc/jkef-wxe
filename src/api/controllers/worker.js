/*
eslint-disable no-console, no-new
 */

import { acceptorManager, statCron } from '../../config';
import { CronJob } from 'cron';

try {
  new CronJob(statCron, async () => {
    await acceptorManager.computeStatByProject();
    await acceptorManager.computeStatByYear();
  }, null, true);
} catch (e) {
  console.log('[STAT CRON JOB ERROR]', e);
}
