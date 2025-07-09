import Knex from 'knex';

// @ts-expect-error getUserHashedPassword from API project
import { getUserHashedPassword } from '../../../api/db/database-builder/factory/build-authentication-method.js';
// @ts-expect-error NON_OIDC_IDENTITY_PROVIDERS from API project
import { NON_OIDC_IDENTITY_PROVIDERS } from '../../../api/src/identity-access-management/domain/constants/identity-providers.js';
// @ts-expect-error AuthenticationMethod from API project
import { AuthenticationMethod } from '../../../api/src/identity-access-management/domain/models/AuthenticationMethod.js';
import {
  PIX_APP_USER_DATA,
  PIX_CERTIF_PRO_DATA,
  PIX_ORGA_PRO_DATA,
  PIX_ORGA_SCO_ISMANAGING_DATA,
  PIX_ORGA_SUP_ISMANAGING_DATA,
} from './db-data.js';

export const knex = Knex({ client: 'postgresql', connection: process.env.DATABASE_URL });

export async function buildStaticData() {
  const hasDataAlreadyBeenBuilt = await knex('users').select({ id: PIX_APP_USER_DATA.id }).first();
  if (!hasDataAlreadyBeenBuilt) {
    await buildAuthenticatedUsers();
    await buildTargetProfile();
    await buildBaseDataForCertification();
  }
}

export async function buildFreshPixCertifUser(firstName: string, lastName: string, email: string, rawPassword: string) {
  const certificationCenterId = await createCertificationCenterInDB('PRO', 'Certification center for ' + email);
  const userId = await createUserInDB(firstName, lastName, email, rawPassword, false, false, undefined);
  await createCertificationCenterMembershipInDB(userId, certificationCenterId);
}

export async function buildFreshPixOrgaUser(firstName: string, lastName: string, email: string, rawPassword: string) {
  const organizationId = await createOrganizationInDB('PRO', 'Organization for ' + email, false);
  const userId = await createUserInDB(firstName, lastName, email, rawPassword, false, false, undefined);
  await createOrganizationMembershipInDB(userId, organizationId);
}

export async function setAssessmentIdSequence(id: number) {
  const result = await knex.raw(`SELECT pg_get_serial_sequence(?, ?) AS sequence_name`, ['assessments', 'id']);
  const sequenceName = result.rows[0]?.sequence_name;
  await knex.raw(`SELECT setval(?, ??, false)`, [sequenceName, id]);
}

async function buildAuthenticatedUsers() {
  // PIX-APP
  await createUserInDB(
    PIX_APP_USER_DATA.firstName,
    PIX_APP_USER_DATA.lastName,
    PIX_APP_USER_DATA.email,
    PIX_APP_USER_DATA.rawPassword,
    true,
    true,
    PIX_APP_USER_DATA.id,
  );

  // PIX-ORGA
  const legalDocumentVersionId = await createLegalDocumentVersionInDB();
  for (const data of [PIX_ORGA_PRO_DATA, PIX_ORGA_SCO_ISMANAGING_DATA, PIX_ORGA_SUP_ISMANAGING_DATA]) {
    const organizationId = await createOrganizationInDB(
      data.organization.type,
      data.organization.externalId,
      data.organization.isManagingStudents,
    );
    const userId = await createUserInDB(
      data.firstName,
      data.lastName,
      data.email,
      data.rawPassword,
      true,
      true,
      data.id,
    );
    await createOrganizationMembershipInDB(userId, organizationId);
    await createLegalDocumentVersionAcceptanceInDB(legalDocumentVersionId, userId);
  }

  // PIX-CERTIF
  const certificationCenterId = await createCertificationCenterInDB(
    PIX_CERTIF_PRO_DATA.certificationCenter.type,
    PIX_CERTIF_PRO_DATA.certificationCenter.externalId,
  );
  const certificationUserId = await createUserInDB(
    PIX_CERTIF_PRO_DATA.firstName,
    PIX_CERTIF_PRO_DATA.lastName,
    PIX_CERTIF_PRO_DATA.email,
    PIX_CERTIF_PRO_DATA.rawPassword,
    true,
    true,
    PIX_CERTIF_PRO_DATA.id,
  );
  await createCertificationCenterMembershipInDB(certificationUserId, certificationCenterId);
}

async function buildTargetProfile() {
  const tubeDTOs: { competenceId: string; tubeId: string }[] = await knex('learningcontent.tubes')
    .distinct()
    .select({
      competenceId: 'learningcontent.competences.id',
      tubeId: 'learningcontent.tubes.id',
    })
    .join('learningcontent.competences', 'learningcontent.tubes.competenceId', 'learningcontent.competences.id')
    .join('learningcontent.skills', 'learningcontent.skills.tubeId', 'learningcontent.tubes.id')
    .join('learningcontent.challenges', 'learningcontent.challenges.skillId', 'learningcontent.skills.id')
    .where('learningcontent.competences.origin', '=', 'Pix')
    .where('learningcontent.skills.status', 'actif')
    .where(
      (queryBuilder: {
        whereRaw: (arg0: string, arg1: string[]) => void;
        orWhereRaw: (arg0: string, arg1: string[]) => void;
      }) => {
        queryBuilder.whereRaw('? = ANY(learningcontent.challenges.locales)', ['fr']);
        queryBuilder.orWhereRaw('? = ANY(learningcontent.challenges.locales)', ['fr-fr']);
      },
    )
    .orderBy('learningcontent.tubes.id');
  const tubesByCompetenceId: Record<string, { competenceId: string; tubeId: string }[]> = Object.groupBy(
    tubeDTOs,
    (tubeDTO: { competenceId: string }) => tubeDTO.competenceId,
  ) as Record<string, { competenceId: string; tubeId: string }[]>;
  const tubeIds = [];
  for (const tubesForCompetence of Object.values(tubesByCompetenceId)) {
    if (!tubesForCompetence) continue;
    tubeIds.push(...tubesForCompetence.slice(0, 2).map((tubeDTO) => tubeDTO.tubeId));
  }
  const targetProfileId = await createTargetProfileInDB('PC pour Playwright');
  await createTargetProfileTubesInDB(targetProfileId, 3, tubeIds);
}

async function buildBaseDataForCertification() {
  await knex('certification-cpf-countries').insert({
    code: '99100',
    commonName: 'FRANCE',
    originalName: 'FRANCE',
    matcher: 'ACEFNR',
  });
  await knex('certification-cpf-cities').insert({
    name: 'PERPIGNAN',
    postalCode: '66000',
    INSEECode: '66136',
    isActualName: true,
  });
  await knex('flash-algorithm-configurations').insert({
    maximumAssessmentLength: 32,
    challengesBetweenSameCompetence: null,
    limitToOneQuestionPerTube: true,
    enablePassageByAllCompetences: true,
    variationPercent: 0.5,
    createdAt: new Date('1977-10-19'),
  });
}

async function createUserInDB(
  firstName: string,
  lastName: string,
  email: string,
  rawPassword: string,
  cgu: boolean,
  pixCertifTermsOfServiceAccepted: boolean,
  id: number | undefined,
) {
  const someDate = new Date('2025-07-09');
  const [{ id: userId }] = await knex('users')
    .insert({
      id,
      firstName,
      lastName,
      email,
      cgu,
      pixCertifTermsOfServiceAccepted,
      lang: 'fr',
      lastTermsOfServiceValidatedAt: cgu ? someDate : null,
      lastPixCertifTermsOfServiceValidatedAt: pixCertifTermsOfServiceAccepted ? someDate : null,
      mustValidateTermsOfService: !cgu,
      hasSeenAssessmentInstructions: false,
      createdAt: someDate,
      updatedAt: someDate,
      emailConfirmedAt: someDate,
    })
    .returning('id');

  await knex('authentication-methods').insert({
    userId: userId,
    identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: getUserHashedPassword(rawPassword),
      shouldChangePassword: false,
    }),
    externalIdentifier: undefined,
    createdAt: someDate,
    updatedAt: someDate,
  });

  return userId;
}

async function createLegalDocumentVersionInDB() {
  const someDate = new Date('2025-07-09');
  const [{ id }] = await knex('legal-document-versions')
    .insert({
      type: 'TOS',
      service: 'pix-orga',
      versionAt: someDate,
    })
    .returning('id');
  return id;
}

async function createOrganizationInDB(type: string, externalId: string, isManagingStudents: boolean) {
  const someDate = new Date('2025-07-09');
  const [{ id }] = await knex('organizations')
    .insert({
      type,
      name: externalId + type,
      logoUrl: null,
      externalId,
      provinceCode: '66',
      isManagingStudents,
      credit: 0,
      createdAt: someDate,
      updatedAt: someDate,
      email: 'contact@example.net',
      documentationUrl: null,
      createdBy: null,
      showNPS: false,
      formNPSUrl: null,
      showSkills: false,
      archivedBy: null,
      archivedAt: null,
      identityProviderForCampaigns: null,
      parentOrganizationId: null,
    })
    .returning('id');
  return id;
}

async function createOrganizationMembershipInDB(userId: number, organizationId: number) {
  const someDate = new Date('2025-07-09');
  await knex('memberships').insert({
    organizationId,
    organizationRole: 'MEMBER',
    userId,
    createdAt: someDate,
    updatedAt: someDate,
    disabledAt: null,
    updatedByUserId: null,
    lastAccessedAt: someDate,
  });
}

async function createLegalDocumentVersionAcceptanceInDB(legalDocumentVersionId: number, userId: number) {
  const someDate = new Date('2025-07-09');
  await knex('legal-document-version-user-acceptances').insert({
    legalDocumentVersionId,
    userId,
    acceptedAt: someDate,
  });
}

async function createCertificationCenterInDB(type: string, externalId: string) {
  const someDate = new Date('2025-07-09');
  const [{ id }] = await knex('certification-centers')
    .insert({
      name: externalId + type,
      type,
      externalId,
      createdAt: someDate,
      createdBy: null,
      updatedAt: someDate,
      isScoBlockedAccessWhitelist: false,
      archivedAt: null,
      archivedBy: null,
    })
    .returning('id');
  return id;
}

async function createCertificationCenterMembershipInDB(userId: number, certificationCenterId: number) {
  const someDate = new Date('2025-07-09');
  await knex('certification-center-memberships').insert({
    userId,
    updatedByUserId: null,
    certificationCenterId,
    createdAt: someDate,
    updatedAt: someDate,
    disabledAt: null,
    isReferer: false,
    role: 'MEMBER',
    lastAccessedAt: someDate,
  });
}

async function createTargetProfileInDB(name: string) {
  const someDate = new Date('2025-07-09');
  const [{ id }] = await knex('target-profiles')
    .insert({
      name,
      ownerOrganizationId: null,
      internalName: name,
      imageUrl: null,
      isSimplifiedAccess: false,
      createdAt: someDate,
      outdated: false,
      description: null,
      comment: null,
      category: 'OTHER',
      migration_status: 'N/A',
      areKnowledgeElementsResettable: false,
    })
    .returning('id');

  const organizationIds = await knex('organizations').pluck('id');
  const targetProfileSharesToInsert = organizationIds.map((organizationId) => ({
    targetProfileId: id,
    organizationId,
  }));
  await knex('target-profile-shares').insert(targetProfileSharesToInsert);
  return id;
}

async function createTargetProfileTubesInDB(targetProfileId: number, level: number, tubeIds: string[]) {
  const dataToInsert = tubeIds.map((tubeId) => ({
    targetProfileId,
    tubeId,
    level,
  }));
  await knex('target-profile_tubes').insert(dataToInsert);
}
