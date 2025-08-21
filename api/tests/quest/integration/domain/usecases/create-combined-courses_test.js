import iconv from 'iconv-lite';

import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Combined course | Domain | UseCases | create-combined-courses', function () {
  it('should create combined course for given payload', async function () {
    // given
    const userId = databaseBuilder.factory.buildUser().id;
    const firstOrganizationId = databaseBuilder.factory.buildOrganization().id;
    const secondOrganizationId = databaseBuilder.factory.buildOrganization().id;

    const targetProfile = databaseBuilder.factory.buildTargetProfile({
      ownerOrganizationId: firstOrganizationId,
    });

    databaseBuilder.factory.buildTargetProfileShare({
      organizationId: secondOrganizationId,
      targetProfileId: targetProfile.id,
    });

    await databaseBuilder.commit();

    const input = `Identifiant des organisations*;Json configuration for quest*;Identifiant du createur des campagnes*
${firstOrganizationId},${secondOrganizationId};"{""name"":""Combinix"",""successRequirements"":[{""requirement_type"":""campaignParticipations"",""comparison"":""all"",""data"":{""targetProfileId"":{""data"":${targetProfile.id},""comparison"":""equal""}}},{""requirement_type"":""passages"",""comparison"":""all"",""data"":{""moduleId"":{""data"":""eeeb4951-6f38-4467-a4ba-0c85ed71321a"",""comparison"":""equal""}}},{""requirement_type"":""passages"",""comparison"":""all"",""data"":{""moduleId"":{""data"":""f32a2238-4f65-4698-b486-15d51935d335"",""comparison"":""equal""}}}]}";${userId}
${firstOrganizationId};"{""name"":""Combinix"",""successRequirements"":[{""requirement_type"":""campaignParticipations"",""comparison"":""all"",""data"":{""targetProfileId"":{""data"":${targetProfile.id},""comparison"":""equal""}}},{""requirement_type"":""passages"",""comparison"":""all"",""data"":{""moduleId"":{""data"":""eeeb4951-6f38-4467-a4ba-0c85ed71321a"",""comparison"":""equal""}}},{""requirement_type"":""passages"",""comparison"":""all"",""data"":{""moduleId"":{""data"":""f32a2238-4f65-4698-b486-15d51935d335"",""comparison"":""equal""}}}]}";${userId}
`;

    const payload = iconv.encode(input, 'UTF-8');

    // when
    await usecases.createCombinedCourses({ payload });

    const [firstCreatedCampaignForFirstOrganization, secondCreatedCampaignForFirstOrganization] = await knex(
      'campaigns',
    )
      .where({ targetProfileId: targetProfile.id, organizationId: firstOrganizationId })
      .orderBy('id');
    const createdCampaignForSecondOrganization = await knex('campaigns')
      .where({ targetProfileId: targetProfile.id, organizationId: secondOrganizationId })
      .first();

    const expectedModules = [
      {
        requirement_type: 'passages',
        comparison: 'all',
        data: {
          moduleId: {
            data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
            comparison: 'equal',
          },
          isTerminated: {
            data: true,
            comparison: 'equal',
          },
        },
      },
      {
        requirement_type: 'passages',
        comparison: 'all',
        data: {
          moduleId: {
            data: 'f32a2238-4f65-4698-b486-15d51935d335',
            comparison: 'equal',
          },
          isTerminated: {
            data: true,
            comparison: 'equal',
          },
        },
      },
    ];

    const expectedFirstQuestForFirstOrganization = {
      name: 'Combinix',
      rewardType: null,
      rewardId: null,
      organizationId: firstOrganizationId,
      eligibilityRequirements: [],
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: firstCreatedCampaignForFirstOrganization.id,
              comparison: 'equal',
            },
            status: {
              data: 'SHARED',
              comparison: 'equal',
            },
          },
        },
        ...expectedModules,
      ],
    };
    const expectedSecondQuestForFirstOrganization = {
      name: 'Combinix',
      rewardType: null,
      rewardId: null,
      organizationId: firstOrganizationId,
      eligibilityRequirements: [],
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: secondCreatedCampaignForFirstOrganization.id,
              comparison: 'equal',
            },
            status: {
              data: 'SHARED',
              comparison: 'equal',
            },
          },
        },
        ...expectedModules,
      ],
    };
    const expectedQuestForSecondOrganization = {
      name: 'Combinix',
      rewardType: null,
      rewardId: null,
      organizationId: secondOrganizationId,
      eligibilityRequirements: [],
      successRequirements: [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            campaignId: {
              data: createdCampaignForSecondOrganization.id,
              comparison: 'equal',
            },
            status: {
              data: 'SHARED',
              comparison: 'equal',
            },
          },
        },
        ...expectedModules,
      ],
    };

    // then
    const [firstCreatedQuestForFirstOrganization, secondCreatedQuestForFirstOrganization] = await knex('quests')
      .where('organizationId', firstOrganizationId)
      .orderBy('id');
    const createdQuestForSecondOrganization = await knex('quests')
      .where('organizationId', secondOrganizationId)
      .first();

    expect(firstCreatedQuestForFirstOrganization.code).not.to.be.null;
    expect(firstCreatedQuestForFirstOrganization.name).to.equal(expectedFirstQuestForFirstOrganization.name);
    expect(firstCreatedQuestForFirstOrganization.successRequirements).to.deep.equal(
      expectedFirstQuestForFirstOrganization.successRequirements,
    );
    expect(firstCreatedCampaignForFirstOrganization.name).to.equal(targetProfile.internalName);
    expect(firstCreatedCampaignForFirstOrganization.title).to.equal(targetProfile.name);

    expect(secondCreatedQuestForFirstOrganization.code).not.to.be.null;
    expect(secondCreatedQuestForFirstOrganization.name).to.equal(expectedSecondQuestForFirstOrganization.name);
    expect(secondCreatedQuestForFirstOrganization.successRequirements).to.deep.equal(
      secondCreatedQuestForFirstOrganization.successRequirements,
    );
    expect(secondCreatedCampaignForFirstOrganization.name).to.equal(targetProfile.internalName);
    expect(secondCreatedCampaignForFirstOrganization.title).to.equal(targetProfile.name);

    expect(createdQuestForSecondOrganization.code).not.to.be.null;
    expect(createdQuestForSecondOrganization.name).to.equal(expectedQuestForSecondOrganization.name);
    expect(createdQuestForSecondOrganization.successRequirements).to.deep.equal(
      expectedQuestForSecondOrganization.successRequirements,
    );
    expect(createdCampaignForSecondOrganization.name).to.equal(targetProfile.internalName);
    expect(createdCampaignForSecondOrganization.title).to.equal(targetProfile.name);
  });

  it('should save same date for each quest in same row, but not for the other rows', async function () {
    // given
    const userId = databaseBuilder.factory.buildUser().id;
    const firstOrganizationId = databaseBuilder.factory.buildOrganization().id;
    const secondOrganizationId = databaseBuilder.factory.buildOrganization().id;

    await databaseBuilder.commit();

    const input = `Identifiant des organisations*;Json configuration for quest*;Identifiant du createur des campagnes*
${firstOrganizationId},${secondOrganizationId};"{""name"":""Combinix"",""successRequirements"":[{""requirement_type"":""passages"",""comparison"":""all"",""data"":{""moduleId"":{""data"":""f32a2238-4f65-4698-b486-15d51935d335"",""comparison"":""equal""}}}]}";${userId}
${firstOrganizationId};"{""name"":""Combinix"",""successRequirements"":[{""requirement_type"":""passages"",""comparison"":""all"",""data"":{""moduleId"":{""data"":""f32a2238-4f65-4698-b486-15d51935d335"",""comparison"":""equal""}}}]}";${userId}
`;

    const payload = iconv.encode(input, 'UTF-8');

    // when
    await usecases.createCombinedCourses({ payload });

    // then
    const [firstCreatedQuestForFirstOrganization, secondCreatedQuestForFirstOrganization] = await knex('quests')
      .where('organizationId', firstOrganizationId)
      .orderBy('id');
    const createdQuestForSecondOrganization = await knex('quests')
      .where('organizationId', secondOrganizationId)
      .first();

    expect(firstCreatedQuestForFirstOrganization.createdAt).to.deep.equal(createdQuestForSecondOrganization.createdAt);
    expect(firstCreatedQuestForFirstOrganization.createdAt).not.to.deep.equal(
      secondCreatedQuestForFirstOrganization.createdAt,
    );
  });
});
