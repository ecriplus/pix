import { patchLearningContentCacheEntry } from '../../../../../src/learning-content/domain/usecases/patch-learning-content-cache-entry.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Learning Content | Unit | Domain | Usecase | Patch learning content cache entry', function () {
  let frameworkRepository,
    areaRepository,
    competenceRepository,
    thematicRepository,
    tubeRepository,
    skillRepository,
    challengeRepository,
    courseRepository,
    tutorialRepository,
    missionRepository;
  let repositories;
  let repositoriesByModel;

  beforeEach(function () {
    frameworkRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    areaRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    competenceRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    thematicRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    tubeRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    skillRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    challengeRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    courseRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    tutorialRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    missionRepository = {
      save: sinon.stub().rejects('should not be called'),
      clearCache: sinon.stub().rejects('should not be called'),
    };
    repositories = {
      frameworkRepository,
      areaRepository,
      competenceRepository,
      thematicRepository,
      tubeRepository,
      skillRepository,
      challengeRepository,
      courseRepository,
      tutorialRepository,
      missionRepository,
    };
    repositoriesByModel = {
      frameworks: frameworkRepository,
      areas: areaRepository,
      competences: competenceRepository,
      thematics: thematicRepository,
      tubes: tubeRepository,
      skills: skillRepository,
      challenges: challengeRepository,
      courses: courseRepository,
      tutorials: tutorialRepository,
      missions: missionRepository,
    };
  });

  describe('#patchLearningContentCacheEntry', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      'frameworks',
      'areas',
      'competences',
      'thematics',
      'tubes',
      'skills',
      'challenges',
      'courses',
      'tutorials',
      'missions',
    ].forEach((modelName) => {
      describe(`when model is ${modelName}`, function () {
        const recordId = 'recId';
        const updatedRecord = Symbol('updated record'); // eslint-disable-line mocha/no-setup-in-describe

        beforeEach(function () {
          repositoriesByModel[modelName].save.withArgs(updatedRecord).resolves();
          repositoriesByModel[modelName].clearCache.withArgs(recordId).returns();
        });

        it(`should call save and clearCache on appropriate repository`, async function () {
          // given
          const learningContent = {
            [modelName]: [
              { attr1: 'attr1 value index 0', id: 'otherRecordId' },
              { attr1: 'attr1 value index 1', id: recordId },
            ],
            someOtherModelName: [{ other: 'entry', id: recordId }],
          };
          const LearningContentCache = {
            instance: {
              get: sinon.stub().resolves(learningContent),
              patch: sinon.stub().resolves(),
            },
          };

          // when
          await patchLearningContentCacheEntry({
            recordId,
            updatedRecord,
            modelName,
            LearningContentCache,
            ...repositories,
          });

          // then
          expect(repositoriesByModel[modelName].save).to.have.been.calledOnceWithExactly(updatedRecord);
          expect(repositoriesByModel[modelName].clearCache).to.have.been.calledOnceWithExactly(recordId);
        });

        describe('when entry is already in cache', function () {
          it('should patch learning content cache with provided updated entry', async function () {
            // given
            const LearningContentCache = {
              instance: {
                get: sinon.stub(),
                patch: sinon.stub(),
              },
            };
            const learningContent = {
              [modelName]: [
                { attr1: 'attr1 value index 0', id: 'otherRecordId' },
                { attr1: 'attr1 value index 1', id: recordId },
              ],
              someOtherModelName: [{ other: 'entry', id: recordId }],
            };
            LearningContentCache.instance.get.resolves(learningContent);

            // when
            await patchLearningContentCacheEntry({
              recordId,
              updatedRecord,
              modelName,
              LearningContentCache,
              ...repositories,
            });

            // then
            expect(LearningContentCache.instance.patch).to.have.been.calledWithExactly({
              operation: 'assign',
              path: `${modelName}[1]`,
              value: updatedRecord,
            });
          });
        });

        describe('when entry is not in cache', function () {
          it('should patch learning content cache by adding provided entry', async function () {
            // given
            const LearningContentCache = {
              instance: {
                get: sinon.stub(),
                patch: sinon.stub(),
              },
            };
            const learningContent = {
              [modelName]: [{ attr1: 'attr1 value index 0', id: 'otherRecordId' }],
              someOtherModelName: [{ other: 'entry', id: recordId }],
            };
            LearningContentCache.instance.get.resolves(learningContent);

            // when
            await patchLearningContentCacheEntry({
              recordId,
              updatedRecord,
              modelName,
              LearningContentCache,
              ...repositories,
            });

            // then
            expect(LearningContentCache.instance.patch).to.have.been.calledWithExactly({
              operation: 'push',
              path: modelName,
              value: updatedRecord,
            });
          });
        });
      });
    });
  });
});
