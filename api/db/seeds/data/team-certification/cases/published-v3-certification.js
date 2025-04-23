import { OrganizationForAdmin } from '../../../../../src/organizational-entities/domain/models/OrganizationForAdmin.js';
import { usecases as organizationalEntitiesUsecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import * as organizationCreationValidator from '../../../../../src/organizational-entities/domain/validators/organization-creation-validator.js';
import * as tooling from '../../common/tooling/index.js';
import { PUBLISHED_SCO_SESSION } from '../constants.js';

/**
 * --- CERTIFICATION CASE ---
 *
 * The goal here is to have an already published SCO certification session
 */
export default async function publishedV3Certification({ databaseBuilder }) {
  const externalId = 'PUBLISHED_SCO_CERTIFICATION_ORGANIZATION';

  // Organization
  const organization = await organizationalEntitiesUsecases.createOrganization({
    organization: new OrganizationForAdmin({
      name: 'Certification Sco Organization #2',
      type: 'SCO',
      isManagingStudents: true,
      externalId,
    }),
    organizationCreationValidator,
  });

  // Published
  await tooling.session.createPublishedScoSession({
    databaseBuilder,
    sessionId: PUBLISHED_SCO_SESSION,
    accessCode: 'AZERTY',
    organizationId: organization.id,
    configSession: {
      maxLevel: 8,
      learnersToRegisterCount: 1,
    },
  });
}
