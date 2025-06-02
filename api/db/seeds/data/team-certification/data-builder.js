import { ProSeed } from './cases/simple-pro-certification.js';
import { ScoManagingStudent } from './cases/simple-sco-managing-students-certification.js';
import { setupConfigurations } from './setup-configuration.js';

async function teamCertificationDataBuilder({ databaseBuilder }) {
  await setupConfigurations({ databaseBuilder });

  // Cases
  await new ProSeed({ databaseBuilder }).create();
  await new ScoManagingStudent({ databaseBuilder }).create();
}

export { teamCertificationDataBuilder };
