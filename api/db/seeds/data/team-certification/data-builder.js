import { ComplementaryCertificationSeed } from './cases/complementary-certification.js';
import { ProSeed } from './cases/simple-pro-certification.js';
import { ScoManagingStudent } from './cases/simple-sco-managing-students-certification.js';
import { setupConfigurations } from './shared/setup-configuration.js';

async function teamCertificationDataBuilder({ databaseBuilder }) {
  // Pix platform configuration
  await setupConfigurations({ databaseBuilder });

  // Cases
  await new ProSeed({ databaseBuilder }).create();
  await new ScoManagingStudent({ databaseBuilder }).create();
  await new ComplementaryCertificationSeed({ databaseBuilder }).create();
}

export { teamCertificationDataBuilder };
