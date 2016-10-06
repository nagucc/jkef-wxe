import { acceptorManager } from '../../config';

const interval = 60000;

setInterval(async () => {
  await acceptorManager.computeStatByProject();
}, interval);

setInterval(async () => {
  await acceptorManager.computeStatByYear();
}, interval);
