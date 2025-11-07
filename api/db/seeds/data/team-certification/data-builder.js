import { logger } from '../../../../src/shared/infrastructure/utils/logger.js';
import { CleaV3Seed } from './cases/simple-CLEA-v3.js';
import { ProSeed } from './cases/simple-pro-certification.js';
import { ScoManagingStudent } from './cases/simple-sco-managing-students-certification.js';
import { SupWithHabilitationsSeed } from './cases/sup-certification-centre-with-habilitations.js';
import { setupConfigurations } from './shared/setup-configuration.js';
import { UnseedableError } from './shared/UnseedableError.js';

export async function teamCertificationDataBuilder({ databaseBuilder }) {
  try {
    // Pix platform configuration
    await setupConfigurations({ databaseBuilder });

    // Cases
    await new SupWithHabilitationsSeed({ databaseBuilder }).create();
    await new ProSeed({ databaseBuilder }).create();
    await new ScoManagingStudent({ databaseBuilder }).create();
    await new CleaV3Seed({ databaseBuilder }).create();
  } catch (error) {
    if (error instanceof UnseedableError) {
      logger.warn(error, 'Certification seeding is only minimal/partial');
    } else {
      throw error;
    }
  }
}
