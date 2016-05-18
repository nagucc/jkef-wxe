import {computeStatByProject} from '../models/data-access';

const interval = 60000;

const statByProject = async () => {
  await computeStatByProject();
  setTimeout(statByProject, interval);
};

statByProject();
