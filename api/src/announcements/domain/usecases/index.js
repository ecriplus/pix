import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as announcementRepository from '../../infrastructure/repositories/announcement-repository.js';

const dependencies = {
  announcementRepository,
};

import { getAnnouncement } from './get-announcement.js';
import { updateAnnouncement } from './update-announcement.js';

const usecasesWithoutInjectedDependencies = {
  getAnnouncement,
  updateAnnouncement,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
