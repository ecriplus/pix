import { up } from '../../../db/migrations/20250807134527_copy-flash-configurations-to-new-table.js';
import { _ } from '../../../src/shared/infrastructure/utils/lodash-utils.js';
import { databaseBuilder, expect, knex } from '../../test-helper.js';

describe('Integration | Migration | 20250807134527_copy-flash-configurations-to-new-table', function () {
  it('should transfer flash-algorithm-configurations from farthest to latest', async function () {
    // given
    databaseBuilder.factory.buildFlashAlgorithmConfiguration({
      maximumAssessmentLength: 30,
      challengesBetweenSameCompetence: 1,
      limitToOneQuestionPerTube: false,
      enablePassageByAllCompetences: false,
      variationPercent: 0.3,
      createdAt: new Date('2020-10-19'),
    });
    databaseBuilder.factory.buildFlashAlgorithmConfiguration({
      maximumAssessmentLength: 32,
      challengesBetweenSameCompetence: null,
      limitToOneQuestionPerTube: true,
      enablePassageByAllCompetences: true,
      variationPercent: 0.5,
      createdAt: new Date('2025-01-01'),
    });
    await databaseBuilder.commit();

    // when
    await up(knex);

    // then
    const certifConfigurations = await knex('certification-configurations').select().orderBy('id');
    const expected = certifConfigurations.map((config) => _.omit(config, ['id']));
    expect(expected).to.deep.equal([
      {
        startingDate: new Date('2020-10-19'),
        expirationDate: new Date('2025-01-01'),
        maximumAssessmentLength: 30,
        challengesBetweenSameCompetence: 1,
        limitToOneQuestionPerTube: false,
        enablePassageByAllCompetences: false,
        variationPercent: 0.3,
        'global-scoring-configuration': null,
        'competences-scoring-configuration': null,
      },
      {
        startingDate: new Date('2025-01-01'),
        expirationDate: null,
        maximumAssessmentLength: 32,
        challengesBetweenSameCompetence: null,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: true,
        variationPercent: 0.5,
        'global-scoring-configuration': null,
        'competences-scoring-configuration': null,
      },
    ]);
  });

  it('should assign the right certification-scoring-configurations', async function () {
    // given
    const createdByUserId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildScoringConfiguration({
      createdAt: new Date('2020-10-19'),
      createdByUserId,
    });
    const theRigthScoring = [{ a: 'b' }];
    databaseBuilder.factory.buildScoringConfiguration({
      createdAt: new Date('2025-01-02'),
      createdByUserId,
      configuration: theRigthScoring,
    });
    databaseBuilder.factory.buildScoringConfiguration({
      createdAt: new Date('2025-09-12'),
      createdByUserId,
    });
    databaseBuilder.factory.buildFlashAlgorithmConfiguration({
      maximumAssessmentLength: 32,
      challengesBetweenSameCompetence: null,
      limitToOneQuestionPerTube: true,
      enablePassageByAllCompetences: true,
      variationPercent: 0.5,
      createdAt: new Date('2025-01-01'),
    });
    await databaseBuilder.commit();

    // when
    await up(knex);

    // then
    const certifConfiguration = await knex('certification-configurations').select().orderBy('id').first();
    expect(certifConfiguration['global-scoring-configuration']).to.deep.equal(theRigthScoring);
  });

  it('should assign the right competence-scoring-configurations', async function () {
    // given
    const createdByUserId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildCompetenceScoringConfiguration({
      createdAt: new Date('2020-10-19'),
      createdByUserId,
      configuration: [],
    });
    const theRigthScoring = [{ comp: 'a' }];
    databaseBuilder.factory.buildCompetenceScoringConfiguration({
      createdAt: new Date('2025-01-02'),
      createdByUserId,
      configuration: theRigthScoring,
    });
    databaseBuilder.factory.buildCompetenceScoringConfiguration({
      createdAt: new Date('2025-09-12'),
      createdByUserId,
      configuration: [],
    });
    databaseBuilder.factory.buildFlashAlgorithmConfiguration({
      maximumAssessmentLength: 32,
      challengesBetweenSameCompetence: null,
      limitToOneQuestionPerTube: true,
      enablePassageByAllCompetences: true,
      variationPercent: 0.5,
      createdAt: new Date('2025-01-01'),
    });
    await databaseBuilder.commit();

    // when
    await up(knex);

    // then
    const certifConfiguration = await knex('certification-configurations').select().orderBy('id').first();
    expect(certifConfiguration['competences-scoring-configuration']).to.deep.equal(theRigthScoring);
  });
});
