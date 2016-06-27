import { computeStatByProject, computeStatByYear } from '../models/data-access';

const interval = 60000;

const statByProject = async () => {
  await computeStatByProject();
  setTimeout(statByProject, interval);
};

const statByYear = async () => {
  await computeStatByYear();
  setTimeout(statByYear, interval);
};

statByProject();
statByYear();
