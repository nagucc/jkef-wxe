import { acceptorManager } from '../../config';

const interval = 60000;

const statByProject = async () => {
  await acceptorManager.computeStatByProject();
  setTimeout(acceptorManager.computeStatByProject.bind(acceptorManager), interval);
};

const statByYear = async () => {
  await acceptorManager.computeStatByYear();
  setTimeout(acceptorManager.computeStatByYear.bind(acceptorManager), interval);
};

statByProject();
statByYear();
