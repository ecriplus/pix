import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { ORGANIZATION_FEATURE } from '../../../../../src/shared/domain/constants.js';
import { createTempFile, databaseBuilder, expect, knex, removeTempFile, sinon } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | add-organization-feature-in-batch', function () {
  let learnerImportfeatureId,
    campaignWithoutUserProfilefeatureId,
    filePath,
    userId,
    learnerImportOrganizationId,
    campaignWithoutUserProfileOrganizationId;

  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    learnerImportfeatureId = databaseBuilder.factory.buildFeature({ key: ORGANIZATION_FEATURE.LEARNER_IMPORT.key }).id;
    campaignWithoutUserProfilefeatureId = databaseBuilder.factory.buildFeature({
      key: ORGANIZATION_FEATURE.CAMPAIGN_WITHOUT_USER_PROFILE.key,
    }).id;

    learnerImportOrganizationId = databaseBuilder.factory.buildOrganization().id;
    campaignWithoutUserProfileOrganizationId = databaseBuilder.factory.buildOrganization().id;

    await databaseBuilder.commit();
  });

  afterEach(async function () {
    await removeTempFile(filePath);
  });

  it('should register feature for right organization', async function () {
    // given
    filePath = await createTempFile(
      'test.csv',
      `Feature ID;Organization ID;Params
    ${learnerImportfeatureId};${learnerImportOrganizationId};{"id": 123}
    ${campaignWithoutUserProfilefeatureId};${campaignWithoutUserProfileOrganizationId};{"id": 456}
`,
    );
    // when
    await usecases.addOrganizationFeatureInBatch({ userId, filePath });

    const result = await knex('organization-features');

    expect(result).lengthOf(2);
    //eslint-disable-next-line no-unused-vars
    expect(result.map(({ id, ...data }) => data)).deep.members([
      {
        featureId: learnerImportfeatureId,
        organizationId: learnerImportOrganizationId,
        params: { id: 123 },
      },
      {
        featureId: campaignWithoutUserProfilefeatureId,
        organizationId: campaignWithoutUserProfileOrganizationId,
        params: { id: 456 },
      },
    ]);
  });

  describe('delete learner cases', function () {
    let activeOrganizationLearnerId, deletedOrganizationLearnerId;
    let oldUserDeletedLearnerId;
    let oldDeletedAt;
    let clock, now;

    beforeEach(async function () {
      now = new Date('2025-01-01');

      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
      oldDeletedAt = new Date('2024-12-12');

      oldUserDeletedLearnerId = databaseBuilder.factory.buildUser().id;
      activeOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: learnerImportOrganizationId,
        deletedAt: null,
        deletedBy: null,
      }).id;
      deletedOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        organizationId: learnerImportOrganizationId,
        deletedAt: oldDeletedAt,
        deletedBy: oldUserDeletedLearnerId,
      }).id;

      await databaseBuilder.commit();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should not delete learners without parameters', async function () {
      filePath = await createTempFile(
        'test.csv',
        `Feature ID;Organization ID;Params
      ${learnerImportfeatureId};${learnerImportOrganizationId};{"id": 123}
      ${campaignWithoutUserProfilefeatureId};${campaignWithoutUserProfileOrganizationId};{"id": 456}
  `,
      );

      // when
      await usecases.addOrganizationFeatureInBatch({ userId, filePath });

      const activeLearners = await knex('organization-learners').whereNull('deletedAt');

      expect(activeLearners).lengthOf(1);
      expect(activeLearners[0].id).equal(activeOrganizationLearnerId);
    });

    it('should delete learners for organizationId given "Delete Learner" parameters to true', async function () {
      databaseBuilder.factory.buildOrganizationLearner({
        organizationId: campaignWithoutUserProfileOrganizationId,
        deletedAt: null,
        deletedBy: null,
      });

      await databaseBuilder.commit();

      filePath = await createTempFile(
        'test.csv',
        `"Feature ID";"Organization ID";"Params";"Delete Learner"
      ${learnerImportfeatureId};${learnerImportOrganizationId};{"id": 123};Y
      ${campaignWithoutUserProfilefeatureId};${campaignWithoutUserProfileOrganizationId};{"id": 456};
  `,
      );

      // when
      await usecases.addOrganizationFeatureInBatch({ userId, filePath });

      const deletedLearners = await knex('organization-learners').whereNotNull('deletedAt').orderBy('deletedAt', 'asc');

      expect(deletedLearners).lengthOf(2);
      expect(
        deletedLearners.map(({ id, deletedAt, deletedBy, organizationId }) => {
          return { id, deletedAt, deletedBy, organizationId };
        }),
      ).deep.members([
        {
          id: deletedOrganizationLearnerId,
          deletedAt: oldDeletedAt,
          deletedBy: oldUserDeletedLearnerId,
          organizationId: learnerImportOrganizationId,
        },
        {
          id: activeOrganizationLearnerId,
          deletedAt: now,
          deletedBy: userId,
          organizationId: learnerImportOrganizationId,
        },
      ]);
    });
  });
});
