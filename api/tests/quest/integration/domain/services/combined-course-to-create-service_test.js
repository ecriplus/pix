import { Campaign } from '../../../../../src/prescription/campaign/domain/models/Campaign.js';
import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import combinedCourseToCreateService from '../../../../../src/quest/domain/services/combined-course-to-create-service.js';
import { repositories } from '../../../../../src/quest/infrastructure/repositories/index.js';
import * as codeGenerator from '../../../../../src/shared/domain/services/code-generator.js';
import { injectDependencies } from '../../../../../src/shared/infrastructure/utils/dependency-injection.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

const { combinedCourseToCreateService: CombinedCourseToCreateService } = injectDependencies(
  { combinedCourseToCreateService },
  {
    moduleRepository: repositories.moduleRepository,
    codeGenerator,
    accessCodeRepository: repositories.accessCodeRepository,
    recommendedModuleRepository: repositories.recommendedModuleRepository,
    targetProfileRepository: repositories.targetProfileRepository,
  },
);

describe('Integration | Quest | Domain | Services | CombinedCourseToCreateService', function () {
  it('should not build campaigns and modules if combined course blueprint does not have them', async function () {
    // given
    const organization = databaseBuilder.factory.buildOrganization();
    const combinedCourseBlueprint = databaseBuilder.factory.buildCombinedCourseBlueprint();
    const creator = databaseBuilder.factory.buildUser();
    databaseBuilder.factory.buildMembership({ organizationId: organization.id, userId: creator.id });
    await databaseBuilder.commit();

    //when
    const result = await CombinedCourseToCreateService.buildModulesAndCampaigns({
      organizationId: organization.id,
      combinedCourseBlueprint,
      creatorId: creator.id,
    });

    //then
    expect(result).to.deep.equal({ campaignsToCreate: [], modules: [] });
  });
  it('should build campaigns and modules if combined course blueprint has them in its content', async function () {
    // given
    const organization = databaseBuilder.factory.buildOrganization();
    const targetProfile = databaseBuilder.factory.buildTargetProfile({ id: 123 });
    databaseBuilder.factory.buildCombinedCourseBlueprint({
      content: [
        { type: 'module', value: '6a68bf32' },
        { type: 'evaluation', value: targetProfile.id },
        { type: 'module', value: '9d4dcab8' },
        { type: 'evaluation', value: targetProfile.id },
      ],
    });
    const combinedCourseBlueprint = new CombinedCourseBlueprint({
      content: [
        { type: 'module', value: '6a68bf32' },
        { type: 'evaluation', value: targetProfile.id },
        { type: 'module', value: '9d4dcab8' },
        { type: 'evaluation', value: targetProfile.id },
      ],
    });
    const creator = databaseBuilder.factory.buildUser();
    databaseBuilder.factory.buildMembership({ organizationId: organization.id, userId: creator.id });
    await databaseBuilder.commit();

    //when
    const result = await CombinedCourseToCreateService.buildModulesAndCampaigns({
      organizationId: organization.id,
      combinedCourseBlueprint,
      creatorId: creator.id,
      combinedCourseCode: 'RANDOM',
    });

    //then
    expect(result).to.deep.equal({
      campaignsToCreate: [
        new Campaign({
          creatorId: creator.id,
          targetProfileId: targetProfile.id,
          organizationId: organization.id,
          customResultPageButtonText: 'Continuer',
          customResultPageButtonUrl: '/parcours/RANDOM',
          ownerId: creator.id,
          title: targetProfile.internalName,
          name: targetProfile.name,
        }),
        new Campaign({
          creatorId: creator.id,
          targetProfileId: targetProfile.id,
          organizationId: organization.id,
          customResultPageButtonText: 'Continuer',
          customResultPageButtonUrl: '/parcours/RANDOM',
          ownerId: creator.id,
          title: targetProfile.internalName,
          name: targetProfile.name,
        }),
      ],
      modules: [
        {
          duration: 5,
          id: '6282925d-4775-4bca-b513-4c3009ec5886',
          image: 'https://assets.pix.org/modules/placeholder-details.svg',
          shortId: '6a68bf32',
          slug: 'bac-a-sable',
          title: 'Bac à sable',
        },
        {
          id: 'f7b3a2e1-0d5c-4c6c-9c4d-1a3d8f7e9f5d',
          shortId: '9d4dcab8',
          slug: 'bien-ecrire-son-adresse-mail',
          title: 'Bien écrire une adresse mail',
          duration: 10,
          image: 'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-details.svg',
        },
      ],
    });
  });
});
