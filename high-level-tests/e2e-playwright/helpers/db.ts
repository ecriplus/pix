import Knex from 'knex';

// @ts-expect-error getUserHashedPassword from API project
import { getUserHashedPassword } from '../../../api/db/database-builder/factory/build-authentication-method.js';
// @ts-expect-error NON_OIDC_IDENTITY_PROVIDERS from API project
import { NON_OIDC_IDENTITY_PROVIDERS } from '../../../api/src/identity-access-management/domain/constants/identity-providers.js';
// @ts-expect-error AuthenticationMethod from API project
import { AuthenticationMethod } from '../../../api/src/identity-access-management/domain/models/AuthenticationMethod.js';
import { PIX_APP_USER_DATA, PIX_CERTIF_PRO_DATA, PIX_ORGA_ADMIN_DATA, PIX_ORGA_MEMBER_DATA } from './db-data.js';

export const knex = Knex({ client: 'postgresql', connection: process.env.DATABASE_URL });

export async function buildStaticData() {
  const hasDataAlreadyBeenBuilt = await knex('users').select({ id: PIX_APP_USER_DATA.id }).first();
  if (!hasDataAlreadyBeenBuilt) {
    await buildAuthenticatedUsers();
    await buildTargetProfile();
    await buildBaseDataForCertification();
  }
}

export async function buildFreshPixAppUser(
  firstName: string,
  lastName: string,
  email: string,
  rawPassword: string,
  mustRevalidateCgu: boolean,
) {
  return createUserInDB(firstName, lastName, email, rawPassword, true, false, mustRevalidateCgu, undefined);
}

export async function buildFreshPixCertifUser(firstName: string, lastName: string, email: string, rawPassword: string) {
  const certificationCenterId = await createCertificationCenterInDB('PRO', 'Certification center for ' + email);
  const userId = await createUserInDB(firstName, lastName, email, rawPassword, false, false, false, undefined);
  await createCertificationCenterMembershipInDB(userId, certificationCenterId);
}

export async function buildFreshPixOrgaUser(
  firstName: string,
  lastName: string,
  email: string,
  rawPassword: string,
  role: string,
  organization: { type: string; externalId: string; isManagingStudents: boolean },
) {
  const organizationId = await createOrganizationInDB(organization);
  const userId = await createUserInDB(firstName, lastName, email, rawPassword, false, false, false, undefined);
  await createOrganizationMembershipInDB(userId, organizationId, role);

  const targetProfileIds = await knex('target-profiles').pluck('id');
  const targetProfileSharesToInsert = targetProfileIds.map((targetProfileId) => ({
    targetProfileId,
    organizationId,
  }));
  await knex('target-profile-shares').insert(targetProfileSharesToInsert);
  return { userId, targetProfileId: targetProfileIds[0] };
}

export async function buildFreshPixOrgaUserWithGenericImport(
  firstName: string,
  lastName: string,
  email: string,
  rawPassword: string,
  role: string,
  organization: { type: string; externalId: string; isManagingStudents: boolean },
) {
  const organizationId = await createOrganizationInDB(organization);
  const userId = await createUserInDB(firstName, lastName, email, rawPassword, true, false, false, undefined);
  await createOrganizationMembershipInDB(userId, organizationId, role);

  const [targetProfileId] = await knex('target-profiles').pluck('id');
  await knex('target-profile-shares').insert({
    targetProfileId,
    organizationId,
  });

  // Create generic import format
  const importFormatConfig = {
    headers: [
      {
        name: 'Nom apprenant',
        config: {
          property: 'lastName',
          validate: { type: 'string', required: true },
          reconcile: { name: 'COMMON_LASTNAME', fieldId: 'reconcileField1', position: 1 },
        },
        required: true,
      },
      {
        name: 'Prénom apprenant',
        config: {
          property: 'firstName',
          validate: { type: 'string', required: true },
          reconcile: { name: 'COMMON_FIRSTNAME', fieldId: 'reconcileField2', position: 2 },
        },
        required: true,
      },
      {
        name: 'Classe',
        config: {
          validate: { type: 'string', required: true },
          exportable: true,
          displayable: { name: 'COMMON_DIVISION', position: 1, filterable: { type: 'string' } },
        },
        required: true,
      },
      {
        name: 'Date de naissance',
        config: {
          validate: { type: 'date', format: 'YYYY-MM-DD', required: true },
          reconcile: { name: 'COMMON_BIRTHDATE', fieldId: 'reconcileField3', position: 3 },
          displayable: { name: 'COMMON_BIRTHDATE', position: 2 },
        },
        required: true,
      },
    ],
    unicityColumns: ['Nom apprenant', 'Prénom apprenant', 'Date de naissance'],
    acceptedEncoding: ['utf8'],
  };

  const [{ id: importFormatId }] = await knex('organization-learner-import-formats')
    .insert({
      name: 'GENERIC',
      fileType: 'csv',
      config: importFormatConfig,
      createdBy: userId,
    })
    .returning('id');

  let featureId = await knex('features')
    .where('key', 'LEARNER_IMPORT')
    .select('id')
    .first()
    .then((row) => row?.id);

  if (!featureId) {
    [{ id: featureId }] = await knex('features')
      .insert({
        key: 'LEARNER_IMPORT',
        description: "Permet l'import de participants sur PixOrga",
      })
      .returning('id');
  }

  await knex('organization-features').insert({
    organizationId,
    featureId,
    params: { organizationLearnerImportFormatId: importFormatId },
  });

  // Create a campaign for this organization
  const campaignCode = 'GENERIC11';
  const [{ id: campaignId }] = await knex('campaigns')
    .insert({
      name: 'Campaign for Generic Import',
      code: campaignCode,
      title: 'Test Generic Import Campaign',
      type: 'ASSESSMENT',
      createdAt: new Date(),
      organizationId,
      creatorId: userId,
      ownerId: userId,
      targetProfileId: targetProfileId,
      assessmentMethod: 'SMART_RANDOM',
      multipleSendings: false,
      isForAbsoluteNovice: false,
    })
    .returning('id');

  return { userId, targetProfileId, campaignCode, campaignId, organizationId };
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
    false,
    PIX_APP_USER_DATA.id,
  );

  // PIX-ORGA
  const legalDocumentVersionId = await createLegalDocumentVersionInDB();
  const createdOrganizations: Record<string, number> = {};
  for (const data of [PIX_ORGA_ADMIN_DATA, PIX_ORGA_MEMBER_DATA]) {
    const userId = await createUserInDB(
      data.firstName,
      data.lastName,
      data.email,
      data.rawPassword,
      true,
      true,
      false,
      data.id,
    );
    await createLegalDocumentVersionAcceptanceInDB(legalDocumentVersionId, userId);

    for (const organization of data.organizations) {
      if (!createdOrganizations[organization.externalId]) {
        const organizationId = await createOrganizationInDB(organization);
        createdOrganizations[organization.externalId] = organizationId;
      }
      await createOrganizationMembershipInDB(userId, createdOrganizations[organization.externalId], data.role);
    }
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
    false,
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
  const [{ id: versionId }] = await knex('certification_versions')
    .insert({
      scope: 'CORE',
      startDate: new Date('2024-10-19'),
      expirationDate: null,
      assessmentDuration: 120,
      globalScoringConfiguration: null,
      competencesScoringConfiguration: null,
      challengesConfiguration: JSON.stringify({
        maximumAssessmentLength: 32,
        challengesBetweenSameCompetence: null,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: true,
        variationPercent: 0.5,
      }),
    })
    .returning('id');
  const challenges = await knex('learningcontent.challenges')
    .whereRaw('?=ANY(??)', ['fr', 'locales'])
    .where('status', 'validé')
    .limit(500);

  for (const challenge of challenges) {
    await knex('certification-frameworks-challenges').insert({
      challengeId: challenge.id,
      discriminant: 1.0,
      difficulty: 2.1,
      versionId,
    });
  }
}

async function createUserInDB(
  firstName: string,
  lastName: string,
  email: string,
  rawPassword: string,
  cgu: boolean,
  pixCertifTermsOfServiceAccepted: boolean,
  mustValidateTermsOfService: boolean,
  id: number | undefined,
) {
  const someDate = new Date();
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
      mustValidateTermsOfService,
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

export const deleteUserFromDB = async (userId: number) => {
  await knex('legal-document-version-user-acceptances').where('userId', userId).delete();
  await knex('user-orga-settings').where('userId', userId).delete();
  await knex('last-user-application-connections').where('userId', userId).delete();
  await knex('user-logins').where('userId', userId).delete();
  await knex('authentication-methods').where('userId', userId).delete();
  await knex('users').where('id', userId).delete();
};

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

export async function createOrganizationInDB({
  type,
  externalId,
  isManagingStudents,
}: {
  type: string;
  externalId: string;
  isManagingStudents: boolean;
}) {
  const someDate = new Date();
  const administrationTeamId = await knex('administration_teams')
    .insert({
      name: `Team for ${externalId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning('id')
    .then((rows) => rows[0].id);

  const [{ id }] = await knex('organizations')
    .insert({
      type,
      name: `Orga ${type.toLowerCase()}`,
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
      administrationTeamId,
      countryCode: 99100,
    })
    .returning('id');
  return id;
}

async function createOrganizationMembershipInDB(userId: number, organizationId: number, role: string) {
  const someDate = new Date();
  await knex('memberships').insert({
    organizationId,
    organizationRole: role,
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

export async function createTargetProfileInDB(name: string) {
  const someDate = new Date();
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

export async function createGARUser(id: string, firstName: string, lastName: string, cgu: boolean) {
  const someDate = new Date();
  const [{ id: userId }] = await knex('users')
    .insert({
      firstName,
      lastName,
      cgu,
      pixCertifTermsOfServiceAccepted: false,
      lang: 'fr',
      lastTermsOfServiceValidatedAt: cgu ? someDate : null,
      lastPixCertifTermsOfServiceValidatedAt: null,
      mustValidateTermsOfService: false,
      hasSeenAssessmentInstructions: false,
      createdAt: someDate,
      updatedAt: someDate,
      emailConfirmedAt: null,
    })
    .returning('id');

  await knex('authentication-methods').insert({
    userId: userId,
    identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
    authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
      firstName,
      lastName,
    }),
    externalIdentifier: `externalGAR-${id}`,
    createdAt: someDate,
    updatedAt: someDate,
  });

  return userId;
}
