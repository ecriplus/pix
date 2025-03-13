import { TargetProfileSummaryForAdmin } from '../../../../src/prescription/target-profile/domain/models/TargetProfileSummaryForAdmin.js';

const buildTargetProfileSummaryForAdmin = function ({
  id = 123,
  internalName = 'Profil cible super cool interne',
  category,
  outdated = false,
  createdAt,
  ownerOrganizationId,
  sharedOrganizationId,
} = {}) {
  return new TargetProfileSummaryForAdmin({
    id,
    internalName,
    outdated,
    category,
    createdAt,
    ownerOrganizationId,
    sharedOrganizationId,
  });
};

export { buildTargetProfileSummaryForAdmin };
