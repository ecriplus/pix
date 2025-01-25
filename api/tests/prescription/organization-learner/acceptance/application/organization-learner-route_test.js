import { REWARD_TYPES } from '../../../../../src/quest/domain/constants.js';
import { config } from '../../../../../src/shared/config.js';
import { ORGANIZATION_FEATURE } from '../../../../../src/shared/domain/constants.js';
import { Membership } from '../../../../../src/shared/domain/models/index.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
  nock,
} from '../../../../test-helper.js';

describe('Prescription | Organization Learner | Acceptance | Application | OrganizationLearnerRoute', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRoleSuperAdmin();
  });

  describe('GET /api/organizations/{organizationId}/attestations/{attestationKey}', function () {
    it('should return 200 status code and right content type', async function () {
      // given
      const attestationFeatureId = databaseBuilder.factory.buildFeature(
        ORGANIZATION_FEATURE.ATTESTATIONS_MANAGEMENT,
      ).id;
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildOrganizationFeature({ organizationId, featureId: attestationFeatureId });
      databaseBuilder.factory.buildMembership({
        userId,
        organizationId,
        organizationRole: Membership.roles.ADMIN,
      });
      const attestation = databaseBuilder.factory.buildAttestation({
        templateName: 'sixth-grade-attestation-template',
      });
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        organizationId,
        division: '6emeA',
      });
      const profileRewardId = databaseBuilder.factory.buildProfileReward({
        userId: organizationLearner.userId,
        rewardId: attestation.id,
        rewardType: REWARD_TYPES.ATTESTATION,
      }).id;
      databaseBuilder.factory.buildOrganizationsProfileRewards({ organizationId, profileRewardId });

      await databaseBuilder.commit();

      const request = {
        method: 'GET',
        url: `/api/organizations/${organizationId}/attestations/${attestation.key}?divisions[]=6emeA`,
        headers: generateAuthenticatedUserRequestHeaders({ userId }),
      };

      // when

      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/zip');
    });
  });

  describe('GET /api/organizations/{organizationId}/organization-learners-level-by-tubes', function () {
    describe('Success case', function () {
      it('should return the organization learner and a 200 status code response', async function () {
        //given
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildMembership({
          organizationId,
          userId,
          organizationRole: Membership.roles.ADMIN,
        });
        const featureId = databaseBuilder.factory.buildFeature(ORGANIZATION_FEATURE.COVER_RATE).id;
        databaseBuilder.factory.buildOrganizationFeature({
          organizationId,
          featureId,
        });
        await databaseBuilder.commit();

        const expectedData = 'expected-data';

        const token = 'token';
        nock(config.apiData.url)
          .post('/token')
          .reply(200, { test: 'test', data: { access_token: token } });

        nock(config.apiData.url)
          .post('/query', {
            queryId: config.apiData.queries.coverRateByTubes,
            params: [{ name: 'organization_id', value: organizationId }],
          })
          .matchHeader('Content-Type', 'application/json')
          .matchHeader('Authorization', `Bearer ${token}`)
          .reply(200, { status: 'success', data: expectedData });

        const options = {
          method: 'GET',
          url: `/api/organizations/${organizationId}/organization-learners-level-by-tubes`,
          headers: generateAuthenticatedUserRequestHeaders({ userId }),
        };

        // when
        const response = await server.inject(options);

        // then
        const expectedResult = {
          data: {
            attributes: {
              data: 'expected-data',
            },
            type: 'analysis-by-tubes',
          },
        };
        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.deep.includes(expectedResult.data);
      });
    });
  });
});
