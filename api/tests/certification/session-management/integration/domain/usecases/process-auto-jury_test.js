import { usecases } from '../../../../../../src/certification/session-management/domain/usecases/index.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import {
  catchErr,
  databaseBuilder,
  expect,
  knex,
  learningContentBuilder,
  mockLearningContent,
} from '../../../../../test-helper.js';

describe('Certification | Session Management | Integration | Domain | UseCase | process-auto-jury_test ', function () {
  context('when it is a V3 certification', function () {
    context('when certification is not completed', function () {
      beforeEach(async function () {
        const easyChallengeParams = {
          alpha: 1,
          delta: -3,
          langues: ['Franco Français'],
        };
        const hardChallengeParams = {
          alpha: 1,
          delta: 3,
          langues: ['Franco Français'],
        };
        const learningContent = [
          {
            id: 'recArea0',
            code: 'area0',
            competences: [
              {
                id: 'recCompetence0',
                index: '1.1',
                tubes: [
                  {
                    id: 'recTube0_0',
                    skills: [
                      {
                        id: 'recSkill0_0',
                        nom: '@recSkill0_0',
                        level: 2,
                        challenges: [{ id: 'recChallenge0_0_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill0_1',
                        nom: '@recSkill0_1',
                        challenges: [{ id: 'recChallenge0_1_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill0_2',
                        nom: '@recSkill0_2',
                        challenges: [{ id: 'recChallenge0_2_0', ...hardChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence1',
                index: '1.2',
                tubes: [
                  {
                    id: 'recTube1_0',
                    skills: [
                      {
                        id: 'recSkill1_0',
                        nom: '@recSkill1_0',
                        challenges: [{ id: 'recChallenge1_0_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill1_1',
                        nom: '@recSkill1_1',
                        challenges: [{ id: 'recChallenge1_1_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill1_2',
                        nom: '@recSkill1_2',
                        challenges: [{ id: 'recChallenge1_2_0', ...hardChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence2',
                index: '1.3',
                tubes: [
                  {
                    id: 'recTube2_0',
                    skills: [
                      {
                        id: 'recSkill2_0',
                        nom: '@recSkill2_0',
                        challenges: [{ id: 'recChallenge2_0_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill2_1',
                        nom: '@recSkill2_1',
                        challenges: [{ id: 'recChallenge2_1_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill2_2',
                        nom: '@recSkill2_2',
                        challenges: [{ id: 'recChallenge2_2_0', ...hardChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence3',
                index: '1.4',
                tubes: [
                  {
                    id: 'recTube3_0',
                    skills: [
                      {
                        id: 'recSkill3_0',
                        nom: '@recSkill3_0',
                        challenges: [{ id: 'recChallenge3_0_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill3_1',
                        nom: '@recSkill3_1',
                        challenges: [{ id: 'recChallenge3_1_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill3_2',
                        nom: '@recSkill3_2',
                        challenges: [{ id: 'recChallenge3_2_0', ...hardChallengeParams }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'recArea1',
            code: 'area1',
            competences: [
              {
                id: 'recCompetence4',
                index: '2.1',
                tubes: [
                  {
                    id: 'recTube4_0',
                    skills: [
                      {
                        id: 'recSkill4_0',
                        nom: '@recSkill4_0',
                        challenges: [{ id: 'recChallenge4_0_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill4_1',
                        nom: '@recSkill4_1',
                        challenges: [{ id: 'recChallenge4_1_0', ...easyChallengeParams }],
                      },
                      {
                        id: 'recSkill4_2',
                        nom: '@recSkill4_2',
                        challenges: [{ id: 'recChallenge4_2_0', ...hardChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence5',
                index: '2.2',
                tubes: [
                  {
                    id: 'recTube5_0',
                    skills: [
                      {
                        id: 'recSkill5_0',
                        nom: '@recSkill5_0',
                        challenges: [{ id: 'recChallenge5_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence6',
                index: '2.3',
                tubes: [
                  {
                    id: 'recTube6_0',
                    skills: [
                      {
                        id: 'recSkill6_0',
                        nom: '@recSkill6_0',
                        challenges: [{ id: 'recChallenge6_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence7',
                index: '2.4',
                tubes: [
                  {
                    id: 'recTube7_0',
                    skills: [
                      {
                        id: 'recSkill7_0',
                        nom: '@recSkill7_0',
                        challenges: [{ id: 'recChallenge7_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'recArea2',
            code: 'area2',
            competences: [
              {
                id: 'recCompetence8',
                index: '3.1',
                tubes: [
                  {
                    id: 'recTube8_0',
                    skills: [
                      {
                        id: 'recSkill8_0',
                        nom: '@recSkill8_0',
                        challenges: [{ id: 'recChallenge8_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence9',
                index: '3.2',
                tubes: [
                  {
                    id: 'recTube9_0',
                    skills: [
                      {
                        id: 'recSkill9_0',
                        nom: '@recSkill9_0',
                        challenges: [{ id: 'recChallenge9_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence10',
                index: '3.3',
                tubes: [
                  {
                    id: 'recTube10_0',
                    skills: [
                      {
                        id: 'recSkill10_0',
                        nom: '@recSkill10_0',
                        challenges: [{ id: 'recChallenge10_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence11',
                index: '3.4',
                tubes: [
                  {
                    id: 'recTube11_0',
                    skills: [
                      {
                        id: 'recSkill11_0',
                        nom: '@recSkill11_0',
                        challenges: [{ id: 'recChallenge11_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'recArea3',
            code: 'area3',
            competences: [
              {
                id: 'recCompetence12',
                index: '4.1',
                tubes: [
                  {
                    id: 'recTube12_0',
                    skills: [
                      {
                        id: 'recSkill12_0',
                        nom: '@recSkill12_0',
                        challenges: [{ id: 'recChallenge12_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence13',
                index: '4.2',
                tubes: [
                  {
                    id: 'recTube13_0',
                    skills: [
                      {
                        id: 'recSkill13_0',
                        nom: '@recSkill13_0',
                        challenges: [{ id: 'recChallenge13_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence14',
                index: '4.3',
                tubes: [
                  {
                    id: 'recTube14_0',
                    skills: [
                      {
                        id: 'recSkill14_0',
                        nom: '@recSkill14_0',
                        challenges: [{ id: 'recChallenge14_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'recArea4',
            code: 'area4',
            competences: [
              {
                id: 'recCompetence15',
                index: '5.1',
                tubes: [
                  {
                    id: 'recTube15_0',
                    skills: [
                      {
                        id: 'recSkill15_0',
                        nom: '@recSkill15_0',
                        challenges: [{ id: 'recChallenge15_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'recCompetence16',
                index: '5.2',
                tubes: [
                  {
                    id: 'recTube16_0',
                    skills: [
                      {
                        id: 'recSkill16_0',
                        nom: '@recSkill16_0',
                        challenges: [{ id: 'recChallenge16_0_0', ...easyChallengeParams }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.fromAreas(learningContent);
        await mockLearningContent(learningContentObjects);

        const configurationCreatorId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCompetenceScoringConfiguration({
          createdByUserId: configurationCreatorId,
          configuration: [
            {
              competence: '1.1',
              values: [
                {
                  bounds: {
                    max: 0,
                    min: -5,
                  },
                  competenceLevel: 0,
                },
                {
                  bounds: {
                    max: 5,
                    min: 0,
                  },
                  competenceLevel: 1,
                },
              ],
            },
          ],
        });
        databaseBuilder.factory.buildScoringConfiguration({ createdByUserId: configurationCreatorId });
        databaseBuilder.factory.buildFlashAlgorithmConfiguration();

        await databaseBuilder.commit();
      });

      it('should score and end assessment by finalization', async function () {
        // given
        const sessionId = databaseBuilder.factory.buildSession({ finalizedAt: new Date() }).id;
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCandidate({
          sessionId,
          userId,
        });
        const createdAt = new Date('2020-01-01T00:00:00Z');
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
          completedAt: null,
          sessionId,
          userId,
          version: AlgorithmEngineVersion.V3,
          createdAt,
        }).id;
        const aStartedAssessmentId = databaseBuilder.factory.buildAssessment({
          certificationCourseId,
          userId,
          state: Assessment.states.STARTED,
          type: Assessment.types.CERTIFICATION,
          createdAt,
        }).id;

        await databaseBuilder.commit();

        // when
        await usecases.processAutoJury({ sessionId });

        // then
        const scoring = await knex('assessment-results').where({ assessmentId: aStartedAssessmentId });
        expect(scoring).to.have.lengthOf(1);

        const assessment = await knex('assessments').where({ id: aStartedAssessmentId }).first();
        expect(assessment.state).to.equal(Assessment.states.ENDED_DUE_TO_FINALIZATION);
      });

      context('when an error occurs', function () {
        it('should rollback auto jury', async function () {
          // given
          // an assessment completed and not ended by finalization
          const sessionId = databaseBuilder.factory.buildSession({ finalizedAt: new Date() }).id;
          const userId = databaseBuilder.factory.buildUser().id;
          databaseBuilder.factory.buildCertificationCandidate({
            sessionId,
            userId,
          });
          const createdAt = new Date('2020-01-01T00:00:00Z');
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
            completedAt: null,
            sessionId,
            userId,
            version: AlgorithmEngineVersion.V3,
            createdAt,
          }).id;
          const aStartedAssessmentId = databaseBuilder.factory.buildAssessment({
            certificationCourseId,
            userId,
            state: Assessment.states.STARTED,
            type: Assessment.types.CERTIFICATION,
            createdAt,
          }).id;

          await databaseBuilder.commit();

          // when
          const errorDuringTransaction = await catchErr(async (sessionId) => {
            await DomainTransaction.execute(async () => {
              await usecases.processAutoJury({ sessionId });
              throw new Error('test error');
            });
          })(sessionId);

          // then
          expect(errorDuringTransaction.message).to.equal('test error');

          const noScoring = await knex('assessment-results').where({ assessmentId: aStartedAssessmentId });
          expect(noScoring).to.be.empty;

          const notEndedDueToFinalization = await knex('assessments').where({ id: aStartedAssessmentId }).first();
          expect(notEndedDueToFinalization.state).to.equal(Assessment.states.STARTED);
        });
      });
    });
  });
});
