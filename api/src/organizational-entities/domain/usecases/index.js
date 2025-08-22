import * as centerRepository from '../../../certification/enrolment/infrastructure/repositories/center-repository.js';
import * as learnersApi from '../../../prescription/learner-management/application/api/learners-api.js';
import * as schoolRepository from '../../../school/infrastructure/repositories/school-repository.js';
import * as codeGenerator from '../../../shared/domain/services/code-generator.js';
import { adminMemberRepository } from '../../../shared/infrastructure/repositories/admin-member.repository.js';
import * as organizationRepository from '../../../shared/infrastructure/repositories/organization-repository.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as certificationCenterRepository from '../../infrastructure/repositories/certification-center.repository.js';
import { certificationCenterApiRepository } from '../../infrastructure/repositories/certification-center-api.repository.js';
import * as certificationCenterForAdminRepository from '../../infrastructure/repositories/certification-center-for-admin.repository.js';
import * as complementaryCertificationHabilitationRepository from '../../infrastructure/repositories/complementary-certification-habilitation.repository.js';
import * as dataProtectionOfficerRepository from '../../infrastructure/repositories/data-protection-officer.repository.js';
import { repositories as organizationalEntitiesRepositories } from '../../infrastructure/repositories/index.js';
import * as organizationFeatureRepository from '../../infrastructure/repositories/organization-feature-repository.js';
import * as organizationTagRepository from '../../infrastructure/repositories/organization-tag.repository.js';
import { tagRepository } from '../../infrastructure/repositories/tag.repository.js';
import * as targetProfileShareRepository from '../../infrastructure/repositories/target-profile-share-repository.js';
import * as organizationCreationValidator from '../validators/organization-creation-validator.js';
import * as organizationValidator from '../validators/organization-with-tags-and-target-profiles.js';

/**
 * @typedef {import ('../../../prescription/learner-management/application/api/learners-api.js')} learnersApi
 * @typedef {import ('../../../shared/infrastructure/repositories/admin-member.repository.js')} AdminMemberRepository
 * @typedef {import ('../../infrastructure/repositories/certification-center-api.repository.js')} certificationCenterApiRepository
 * @typedef {import ('../../infrastructure/repositories/certification-center.repository.js')} CertificationCenterRepository
 * @typedef {import ('../../../certification/enrolment/infrastructure/repositories/center-repository.js')} CenterRepository
 * @typedef {import ('../../infrastructure/repositories/certification-center-for-admin-repository.js')} CertificationCenterForAdminRepository
 * @typedef {import ('../../infrastructure/repositories/complementary-certification-habilitation-repository.js')} ComplementaryCertificationHabilitationRepository
 * @typedef {import ('../../infrastructure/repositories/data-protection-officer-repository.js')} DataProtectionOfficerRepository
 * @typedef {import ('../../infrastructure/repositories/organization-feature-repository.js')} OrganizationFeatureRepository
 * @typedef {import ('../../infrastructure/repositories/organization-for-admin.repository.js')} OrganizationForAdminRepository
 * @typedef {import ('../../infrastructure/repositories/tag.repository.js')} TagRepository
 * @typedef {import ('../../infrastructure/repositories/target-profile-share-repository.js')} TargetProfileShareRepository

 * @typedef {import ('../../../shared/infrastructure/repositories/organization-repository.js')} OrganizationRepository
 * @typedef {import ('../../../school/infrastructure/repositories/school-repository.js')} SchoolRepository
 * @typedef {import ('../validators/organization-creation-validator.js')} OrganizationCreationValidator
 */

const repositories = {
  adminMemberRepository,
  organizationValidator,
  organizationCreationValidator,
  codeGenerator,
  centerRepository,
  certificationCenterRepository,
  certificationCenterForAdminRepository,
  dataProtectionOfficerRepository,
  certificationCenterApiRepository,
  complementaryCertificationHabilitationRepository,
  organizationForAdminRepository: organizationalEntitiesRepositories.organizationForAdminRepository,
  organizationFeatureRepository,
  schoolRepository,
  learnersApi,
  organizationRepository,
  organizationTagRepository,
  tagRepository,
  targetProfileShareRepository,
};

const dependencies = Object.assign({}, repositories);

import { addOrganizationFeatureInBatch } from './add-organization-feature-in-batch.usecase.js';
import { addTagsToOrganizations } from './add-tags-to-organizations.usecase.js';
import { archiveCertificationCenter } from './archive-certification-center.usecase.js';
import { archiveCertificationCentersInBatch } from './archive-certification-centers-in-batch.usecase.js';
import { archiveOrganization } from './archive-organization.usecase.js';
import { archiveOrganizationsInBatch } from './archive-organizations-in-batch.usecase.js';
import { attachChildOrganizationToOrganization } from './attach-child-organization-to-organization.js';
import { createCertificationCenter } from './create-certification-center.usecase.js';
import { createOrganization } from './create-organization.js';
import { createOrganizationsWithTagsAndTargetProfiles } from './create-organizations-with-tags-and-target-profiles.usecase.js';
import { createTag } from './create-tag.js';
import { findAllTags } from './find-all-tags.usecase.js';
import { findChildrenOrganizations } from './find-children-organizations.usecase.js';
import { findOrganizationFeatures } from './find-organization-features.js';
import { findPaginatedFilteredCertificationCenters } from './find-paginated-filtered-certification-centers.usecase.js';
import { findPaginatedFilteredOrganizations } from './find-paginated-filtered-organizations.usecase.js';
import { getCenterForAdmin } from './get-center-for-admin.usecase.js';
import { getOrganizationById } from './get-organization-by-id.js';
import { getOrganizationDetails } from './get-organization-details.usecase.js';
import { getRecentlyUsedTags } from './get-recently-used-tags.usecase.js';
import { updateCertificationCenter } from './update-certification-center.usecase.js';
import { updateCertificationCenterDataProtectionOfficerInformation } from './update-certification-center-data-protection-officer-information.usecase.js';
import { updateOrganizationInformation } from './update-organization-information.usecase.js';
import { updateOrganizationsInBatch } from './update-organizations-in-batch.usecase.js';

const usecasesWithoutInjectedDependencies = {
  addOrganizationFeatureInBatch,
  addTagsToOrganizations,
  archiveCertificationCenter,
  archiveCertificationCentersInBatch,
  archiveOrganization,
  archiveOrganizationsInBatch,
  attachChildOrganizationToOrganization,
  createCertificationCenter,
  createOrganization,
  createOrganizationsWithTagsAndTargetProfiles,
  createTag,
  findAllTags,
  findChildrenOrganizations,
  findOrganizationFeatures,
  findPaginatedFilteredCertificationCenters,
  findPaginatedFilteredOrganizations,
  getCenterForAdmin,
  getOrganizationById,
  getOrganizationDetails,
  getRecentlyUsedTags,
  updateCertificationCenterDataProtectionOfficerInformation,
  updateCertificationCenter,
  updateOrganizationInformation,
  updateOrganizationsInBatch,
};
/**
 * @typedef OrganizationalEntitiesUsecases
 * @property {addOrganizationFeatureInBatch} addOrganizationFeatureInBatch
 * @property {attachChildOrganizationToOrganization} attachChildOrganizationToOrganization
 * @property {createCertificationCenter} createCertificationCenter
 * @property {createTag} createTag
 * @property {findPaginatedFilteredCertificationCenters} findPaginatedFilteredCertificationCenters
 * @property {getOrganizationDetails} getOrganizationDetails
 * @property {updateOrganizationsInBatch} updateOrganizationsInBatch
 * @property {updateOrganizationInformation} updateOrganizationInformation
 * @property {archiveOrganizationsInBatch} archiveOrganizationsInBatch
 */

/**
 * @type {OrganizationalEntitiesUsecases}
 */
const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
