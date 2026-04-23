import { expect } from 'chai';
import sinon from 'sinon';

import {
  candidateCertificationReferential,
  getNextChallenge,
} from '../../../../../../src/certification/evaluation/domain/usecases/get-next-challenge.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { AssessmentEndedError } from '../../../../../../src/shared/domain/errors.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';
import { catchErr } from '../../../../../tooling/test-utils/error.js';

describe('Unit | Domain | Use Cases | get-next-challenge', function () {
  describe('#getNextChallenge', function () {
    let answerRepository,
      sharedChallengeRepository,
      calibratedChallengeRepository,
      complementaryCertificationRepository,
      assessmentSheetRepository,
      certificationChallengeLiveAlertRepository,
      sessionManagementCertificationChallengeRepository,
      pickChallengeService,
      flashAlgorithmService,
      versionApi;

    let version;
    let certificationCandidateId;
    let assessment;
    let assessmentSheet;

    beforeEach(function () {
      versionApi = {
        getById: sinon.stub(),
      };
      assessmentSheetRepository = {
        getByAssessmentId: sinon.stub(),
      };
      answerRepository = {
        findByAssessment: sinon.stub(),
      };
      sharedChallengeRepository = {
        get: sinon.stub(),
      };
      calibratedChallengeRepository = {
        findActiveFlashCompatible: sinon.stub(),
        getMany: sinon.stub(),
      };
      complementaryCertificationRepository = {
        get: sinon.stub(),
      };
      certificationChallengeLiveAlertRepository = {
        getLiveAlertValidatedChallengeIdsByAssessmentId: sinon.stub(),
      };
      sessionManagementCertificationChallengeRepository = {
        save: sinon.stub(),
        getNextChallengeByCourseId: sinon.stub(),
      };
      pickChallengeService = {
        getChallengePicker: sinon.stub(),
      };
      flashAlgorithmService = {
        getPossibleNextChallenges: sinon.stub(),
        getCapacityAndErrorRate: sinon.stub(),
      };
      assessment = domainBuilder.buildAssessment();
      version = domainBuilder.certification.configuration.buildVersion();

      assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        certificationCourseId: 123,
        assessmentId: assessment.id,
        userId: 456,
        state: Assessment.states.COMPLETED,
        assessmentUpdatedAt: new Date('2023-10-05'),
        versionId: version.id,
        certificationFramework: Frameworks.EDU_1ER_DEGRE,
        accessibilityAdjustmentNeeded: false,
        lang: 'fr-fr',
      });

      versionApi.getById.withArgs({ id: version.id }).resolves(version);

      assessmentSheetRepository.getByAssessmentId.withArgs(assessment.id).resolves(assessmentSheet);
    });

    context('when there are challenges left to answer', function () {
      context('when candidate has a registered certification language', function () {
        it('should save the returned next challenge using the registered language', async function () {
          // given
          const nextCalibratedChallenge = domainBuilder.certification.evaluation.buildCalibratedChallenge({
            blindnessCompatibility: 'KO',
          });
          const challenge = domainBuilder.buildChallenge(nextCalibratedChallenge);
          const complementaryCertificationId = 123;
          const complementaryCertification =
            domainBuilder.certification.complementaryCertification.buildComplementaryCertification({
              id: complementaryCertificationId,
              key: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
            });

          answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
          certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
            .withArgs({ assessmentId: assessmentSheet.assessmentId })
            .resolves([]);

          sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
            .withArgs(assessmentSheet.certificationCourseId, [])
            .resolves(null);
          sharedChallengeRepository.get.resolves();

          complementaryCertificationRepository.get
            .withArgs({ id: complementaryCertificationId })
            .resolves(complementaryCertification);

          calibratedChallengeRepository.findActiveFlashCompatible.resolves([nextCalibratedChallenge]);
          calibratedChallengeRepository.getMany.withArgs({ ids: [], version }).resolves([]);

          flashAlgorithmService.getCapacityAndErrorRate
            .withArgs({
              allAnswers: [],
              challenges: [nextCalibratedChallenge],
              capacity: version.challengesConfiguration.defaultCandidateCapacity,
              variationPercent: version.challengesConfiguration.variationPercent,
            })
            .returns({ capacity: 0 });

          flashAlgorithmService.getPossibleNextChallenges
            .withArgs({
              availableChallenges: [nextCalibratedChallenge],
              capacity: 0,
            })
            .returns([nextCalibratedChallenge]);

          const getChallengePickerImpl = sinon.stub();
          getChallengePickerImpl
            .withArgs({
              possibleChallenges: [nextCalibratedChallenge],
            })
            .returns(nextCalibratedChallenge);
          pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

          sharedChallengeRepository.get.withArgs(nextCalibratedChallenge.id).resolves(challenge);

          // when
          const returnedChallenge = await getNextChallenge({
            assessmentSheetRepository,
            answerRepository,
            assessmentId: assessment.id,
            sessionManagementCertificationChallengeRepository,
            certificationChallengeLiveAlertRepository,
            sharedChallengeRepository,
            versionApi,
            calibratedChallengeRepository,
            flashAlgorithmService,
            pickChallengeService,
            complementaryCertificationRepository,
          });

          // then
          expect(challenge).to.equal(returnedChallenge);
        });
      });

      context('when candidate has no registered certification language', function () {
        it('should save the returned next challenge using the locale', async function () {
          // given
          assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
            certificationCourseId: 123,
            assessmentId: assessment.id,
            userId: 456,
            state: Assessment.states.COMPLETED,
            assessmentUpdatedAt: new Date('2023-10-05'),
            versionId: version.id,
            certificationFramework: Frameworks.EDU_1ER_DEGRE,
            accessibilityAdjustmentNeeded: false,
            lang: null,
          });
          assessmentSheetRepository.getByAssessmentId.withArgs(assessment.id).resolves(assessmentSheet);
          const locale = 'fr-be';
          const nextCalibratedChallenge = domainBuilder.certification.evaluation.buildCalibratedChallenge({
            blindnessCompatibility: 'KO',
          });
          const challenge = domainBuilder.buildChallenge(nextCalibratedChallenge);
          const complementaryCertificationId = 123;
          const complementaryCertification =
            domainBuilder.certification.complementaryCertification.buildComplementaryCertification({
              id: complementaryCertificationId,
              key: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
            });

          answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
          certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
            .withArgs({ assessmentId: assessmentSheet.assessmentId })
            .resolves([]);

          sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
            .withArgs(assessmentSheet.certificationCourseId, [])
            .resolves(null);
          sharedChallengeRepository.get.resolves();

          complementaryCertificationRepository.get
            .withArgs({ id: complementaryCertificationId })
            .resolves(complementaryCertification);

          calibratedChallengeRepository.findActiveFlashCompatible
            .withArgs({ locale, version })
            .resolves([nextCalibratedChallenge]);
          calibratedChallengeRepository.getMany.withArgs({ ids: [], version }).resolves([]);

          flashAlgorithmService.getCapacityAndErrorRate
            .withArgs({
              allAnswers: [],
              challenges: [nextCalibratedChallenge],
              capacity: version.challengesConfiguration.defaultCandidateCapacity,
              variationPercent: version.challengesConfiguration.variationPercent,
            })
            .returns({ capacity: 0 });

          flashAlgorithmService.getPossibleNextChallenges
            .withArgs({
              availableChallenges: [nextCalibratedChallenge],
              capacity: 0,
            })
            .returns([nextCalibratedChallenge]);

          const getChallengePickerImpl = sinon.stub();
          getChallengePickerImpl
            .withArgs({
              possibleChallenges: [nextCalibratedChallenge],
            })
            .returns(nextCalibratedChallenge);
          pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

          sharedChallengeRepository.get.withArgs(nextCalibratedChallenge.id).resolves(challenge);

          // when
          const returnedChallenge = await getNextChallenge({
            assessmentSheetRepository,
            answerRepository,
            assessmentId: assessment.id,
            sessionManagementCertificationChallengeRepository,
            certificationChallengeLiveAlertRepository,
            sharedChallengeRepository,
            versionApi,
            locale,
            calibratedChallengeRepository,
            flashAlgorithmService,
            pickChallengeService,
            complementaryCertificationRepository,
          });

          // then
          expect(challenge).to.equal(returnedChallenge);
        });
      });

      context('when candidate needs accessibility adjustment', function () {
        it('should only pick among challenges with no accessibilities issues', async function () {
          // given
          const nextCalibratedChallenge = domainBuilder.certification.evaluation.buildCalibratedChallenge({
            id: 'recCHAL1',
            blindnessCompatibility: 'RAS',
            colorBlindnessCompatibility: 'OK',
          });
          const challenge = domainBuilder.buildChallenge(nextCalibratedChallenge);
          const accessibleChallenge = domainBuilder.certification.evaluation.buildCalibratedChallenge({
            id: 'recCHAL2',
            blindnessCompatibility: 'OK',
            colorBlindnessCompatibility: 'RAS',
          });
          const allChallenges = [
            nextCalibratedChallenge,
            accessibleChallenge,
            domainBuilder.certification.evaluation.buildCalibratedChallenge({
              blindnessCompatibility: 'autre chose',
              colorBlindnessCompatibility: 'OK',
            }),
          ];

          answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
          certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
            .withArgs({ assessmentId: assessmentSheet.assessmentId })
            .resolves([]);

          sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
            .withArgs(assessmentSheet.certificationCourseId, [])
            .resolves(null);

          calibratedChallengeRepository.findActiveFlashCompatible
            .withArgs({
              locale: assessmentSheet.lang,
              version,
            })
            .resolves(allChallenges);

          calibratedChallengeRepository.getMany.withArgs({ ids: [], version }).resolves([]);

          flashAlgorithmService.getCapacityAndErrorRate
            .withArgs({
              allAnswers: [],
              challenges: [nextCalibratedChallenge, accessibleChallenge],
              capacity: version.challengesConfiguration.defaultCandidateCapacity,
              variationPercent: version.challengesConfiguration.variationPercent,
            })
            .returns({ capacity: 0 });

          flashAlgorithmService.getPossibleNextChallenges
            .withArgs({
              availableChallenges: [nextCalibratedChallenge, accessibleChallenge],
              capacity: 0,
            })
            .returns([nextCalibratedChallenge]);

          const getChallengePickerImpl = sinon.stub();
          getChallengePickerImpl
            .withArgs({
              possibleChallenges: [nextCalibratedChallenge],
            })
            .returns(nextCalibratedChallenge);
          pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

          sharedChallengeRepository.get.withArgs(nextCalibratedChallenge.id).resolves(challenge);

          // when
          const returnedChallenge = await getNextChallenge({
            answerRepository,
            assessmentId: assessmentSheet.assessmentId,
            sessionManagementCertificationChallengeRepository,
            certificationChallengeLiveAlertRepository,
            calibratedChallengeRepository,
            sharedChallengeRepository,
            versionApi,
            flashAlgorithmService,
            pickChallengeService,
            assessmentSheetRepository,
            complementaryCertificationRepository,
          });

          // then
          expect(returnedChallenge).to.equal(challenge);
        });
      });

      context('when resuming the session', function () {
        it('should return the last seen challenge', async function () {
          // given
          const v3CertificationCourse = domainBuilder.buildCertificationCourse({
            version: AlgorithmEngineVersion.V3,
          });

          const nonAnsweredCertificationChallenge = domainBuilder.buildCertificationChallenge({
            courseId: v3CertificationCourse.getId(),
          });

          const lastSeenChallenge = domainBuilder.buildChallenge({
            id: nonAnsweredCertificationChallenge.challengeId,
          });

          answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
          certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
            .withArgs({ assessmentId: assessmentSheet.assessmentId })
            .resolves([]);

          sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
            .withArgs(assessmentSheet.certificationCourseId, [])
            .resolves(nonAnsweredCertificationChallenge);
          sharedChallengeRepository.get
            .withArgs(nonAnsweredCertificationChallenge.challengeId)
            .resolves(lastSeenChallenge);

          // when
          const challenge = await getNextChallenge({
            answerRepository,
            assessmentId: assessment.id,
            sessionManagementCertificationChallengeRepository,
            certificationChallengeLiveAlertRepository,
            sharedChallengeRepository,
            calibratedChallengeRepository,
            versionApi,
            flashAlgorithmService,
            pickChallengeService,
            assessmentSheetRepository,
            complementaryCertificationRepository,
          });

          // then
          expect(challenge).to.equal(lastSeenChallenge);
          expect(sessionManagementCertificationChallengeRepository.save).not.to.have.been.called;
        });
      });
    });

    context('when some answered challenges are not valid anymore', function () {
      it('saves next challenge', async function () {
        // given
        const nextCalibratedChallenge = domainBuilder.buildChallenge({
          id: 'nextCalibratedChallenge',
          blindnessCompatibility: 'KO',
          status: 'validé',
          skill: domainBuilder.buildSkill({ id: 'nottAnsweredSkill' }),
        });
        const challenge = domainBuilder.buildChallenge(nextCalibratedChallenge);
        const alreadyAnsweredChallenge = domainBuilder.buildChallenge({
          id: 'alreadyAnsweredChallenge',
          status: 'validé',
        });
        const outdatedChallenge = domainBuilder.buildChallenge({ id: 'outdatedChallenge', status: 'périmé' });

        const answerStillValid = domainBuilder.buildAnswer({ challengeId: alreadyAnsweredChallenge.id });
        const answerWithOutdatedChallenge = domainBuilder.buildAnswer({ challengeId: outdatedChallenge.id });
        answerRepository.findByAssessment
          .withArgs(assessmentSheet.assessmentId)
          .resolves([answerStillValid, answerWithOutdatedChallenge]);

        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId: assessmentSheet.assessmentId })
          .resolves([]);

        sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
          .withArgs(assessmentSheet.certificationCourseId, [])
          .resolves(null);
        sharedChallengeRepository.get.resolves();

        calibratedChallengeRepository.findActiveFlashCompatible
          .withArgs({
            locale: assessmentSheet.lang,
            version,
          })
          .resolves([alreadyAnsweredChallenge, nextCalibratedChallenge]);

        calibratedChallengeRepository.getMany
          .withArgs({ ids: [alreadyAnsweredChallenge.id, outdatedChallenge.id], version })
          .resolves([alreadyAnsweredChallenge, outdatedChallenge]);

        flashAlgorithmService.getCapacityAndErrorRate
          .withArgs({
            allAnswers: [answerStillValid, answerWithOutdatedChallenge],
            challenges: [alreadyAnsweredChallenge, outdatedChallenge, nextCalibratedChallenge],
            capacity: version.challengesConfiguration.defaultCandidateCapacity,
            variationPercent: version.challengesConfiguration.variationPercent,
          })
          .returns({ capacity: 0 });

        flashAlgorithmService.getPossibleNextChallenges
          .withArgs({
            availableChallenges: [nextCalibratedChallenge],
            capacity: 0,
          })
          .returns([nextCalibratedChallenge]);

        const getChallengePickerImpl = sinon.stub();
        getChallengePickerImpl
          .withArgs({
            possibleChallenges: [nextCalibratedChallenge],
          })
          .returns(nextCalibratedChallenge);
        pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

        sharedChallengeRepository.get.withArgs(nextCalibratedChallenge.id).resolves(challenge);

        // when
        const returnedChallenge = await getNextChallenge({
          answerRepository,
          assessmentId: assessment.id,
          sessionManagementCertificationChallengeRepository,
          certificationChallengeLiveAlertRepository,
          sharedChallengeRepository,
          calibratedChallengeRepository,
          versionApi,
          flashAlgorithmService,
          pickChallengeService,
          assessmentSheetRepository,
          complementaryCertificationRepository,
        });

        // then
        expect(returnedChallenge).to.equal(challenge);
      });
    });

    context('when there are challenges with validated live alerts', function () {
      it('should save the returned next challenge', async function () {
        // given
        const skill = domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({ id: 'skill1' });

        const v3CertificationCourse = domainBuilder.buildCertificationCourse({
          version: AlgorithmEngineVersion.V3,
        });

        const nonAnsweredCertificationChallenge = domainBuilder.buildCertificationChallenge({
          courseId: v3CertificationCourse.getId(),
        });

        const nextCalibratedChallenge = domainBuilder.certification.evaluation.buildCalibratedChallenge({
          id: 'NextChallenge',
          skill,
        });
        const challenge = domainBuilder.buildChallenge(nextCalibratedChallenge);

        const lastSeenChallenge = domainBuilder.buildChallenge({
          id: nonAnsweredCertificationChallenge.challengeId,
        });

        answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);

        calibratedChallengeRepository.findActiveFlashCompatible
          .withArgs({
            locale: assessmentSheet.lang,
            version,
          })
          .resolves([nextCalibratedChallenge, lastSeenChallenge]);
        calibratedChallengeRepository.getMany.withArgs({ ids: [], version }).resolves([]);

        flashAlgorithmService.getCapacityAndErrorRate
          .withArgs({
            allAnswers: [],
            challenges: [nextCalibratedChallenge],
            capacity: version.challengesConfiguration.defaultCandidateCapacity,
            variationPercent: version.challengesConfiguration.variationPercent,
          })
          .returns({ capacity: 0 });

        flashAlgorithmService.getPossibleNextChallenges
          .withArgs({
            availableChallenges: [nextCalibratedChallenge],
            capacity: 0,
          })
          .returns([nextCalibratedChallenge]);

        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId: assessmentSheet.assessmentId })
          .resolves([nonAnsweredCertificationChallenge.challengeId]);

        sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
          .withArgs(assessmentSheet.certificationCourseId, [])
          .resolves(nonAnsweredCertificationChallenge);

        const getChallengePickerImpl = sinon.stub();
        getChallengePickerImpl
          .withArgs({
            possibleChallenges: [nextCalibratedChallenge],
          })
          .returns(nextCalibratedChallenge);
        pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

        sharedChallengeRepository.get.withArgs(nextCalibratedChallenge.id).resolves(challenge);

        // when
        const returnedChallenge = await getNextChallenge({
          answerRepository,
          assessmentId: assessment.id,
          sessionManagementCertificationChallengeRepository,
          certificationChallengeLiveAlertRepository,
          sharedChallengeRepository,
          calibratedChallengeRepository,
          versionApi,
          flashAlgorithmService,
          pickChallengeService,
          assessmentSheetRepository,
          complementaryCertificationRepository,
        });

        // then
        expect(returnedChallenge).to.equal(challenge);
        expect(sessionManagementCertificationChallengeRepository.save).to.have.been.called;
      });

      it('should not return a challenge with the same skill', async function () {
        // given
        const firstSkill = domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({ id: 'skill1' });
        const secondSkill = domainBuilder.certification.evaluation.buildCalibratedChallengeSkill({ id: 'skill2' });

        const v3CertificationCourse = domainBuilder.buildCertificationCourse({
          version: AlgorithmEngineVersion.V3,
        });

        const nonAnsweredCertificationChallenge = domainBuilder.buildCertificationChallenge({
          courseId: v3CertificationCourse.getId(),
        });

        const calibratedChallengeWithLiveAlertedSkill = domainBuilder.certification.evaluation.buildCalibratedChallenge(
          {
            id: 'NextChallenge',
            skill: firstSkill,
          },
        );

        const calibratedChallengeWithOtherSkill = domainBuilder.certification.evaluation.buildCalibratedChallenge({
          id: 'NextChallenge',
          skill: secondSkill,
        });

        const challenge = domainBuilder.buildChallenge(calibratedChallengeWithOtherSkill);

        const calibratedChallengeWithLiveAlert = domainBuilder.certification.evaluation.buildCalibratedChallenge({
          id: nonAnsweredCertificationChallenge.challengeId,
          skill: firstSkill,
        });

        answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
        calibratedChallengeRepository.findActiveFlashCompatible
          .withArgs()
          .resolves([
            calibratedChallengeWithLiveAlert,
            calibratedChallengeWithOtherSkill,
            calibratedChallengeWithLiveAlertedSkill,
          ]);
        calibratedChallengeRepository.getMany.withArgs({ ids: [], version }).resolves([]);

        flashAlgorithmService.getCapacityAndErrorRate
          .withArgs({
            allAnswers: [],
            challenges: [calibratedChallengeWithOtherSkill],
            capacity: version.challengesConfiguration.defaultCandidateCapacity,
            variationPercent: version.challengesConfiguration.variationPercent,
          })
          .returns({ capacity: 0 });

        flashAlgorithmService.getPossibleNextChallenges
          .withArgs({
            availableChallenges: [calibratedChallengeWithOtherSkill],
            capacity: 0,
          })
          .returns([calibratedChallengeWithOtherSkill]);

        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId: assessmentSheet.assessmentId })
          .resolves([nonAnsweredCertificationChallenge.challengeId]);

        sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
          .withArgs(assessmentSheet.certificationCourseId, [])
          .resolves(nonAnsweredCertificationChallenge);

        const getChallengePickerImpl = sinon.stub();
        getChallengePickerImpl
          .withArgs({
            possibleChallenges: [calibratedChallengeWithOtherSkill],
          })
          .returns(calibratedChallengeWithOtherSkill);
        pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

        sharedChallengeRepository.get.withArgs(calibratedChallengeWithOtherSkill.id).resolves(challenge);

        // when
        const returnedChallenge = await getNextChallenge({
          answerRepository,
          assessmentId: assessmentSheet.assessmentId,
          sessionManagementCertificationChallengeRepository,
          certificationChallengeLiveAlertRepository,
          calibratedChallengeRepository,
          sharedChallengeRepository,
          versionApi,
          flashAlgorithmService,
          pickChallengeService,
          assessmentSheetRepository,
          complementaryCertificationRepository,
        });

        // then
        expect(returnedChallenge).to.equal(challenge);
        expect(sessionManagementCertificationChallengeRepository.save).to.have.been.called;
      });
    });

    context('when there are no challenges left', function () {
      it('should return the AssessmentEndedError', async function () {
        // given
        const answeredChallenge = domainBuilder.buildChallenge();
        const answer = domainBuilder.buildAnswer({ challengeId: answeredChallenge.id });

        const flashAlgorithmService = {
          getPossibleNextChallenges: sinon.stub(),
          getCapacityAndErrorRate: sinon.stub(),
        };

        version = domainBuilder.certification.configuration.buildVersion({
          challengesConfiguration: { maximumAssessmentLength: 1 },
        });
        versionApi.getById.withArgs({ id: version.id }).resolves(version);

        assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
          certificationCourseId: 123,
          assessmentId: assessment.id,
          userId: 456,
          state: Assessment.states.COMPLETED,
          assessmentUpdatedAt: new Date('2023-10-05'),
          versionId: version.id,
          certificationFramework: Frameworks.EDU_1ER_DEGRE,
          accessibilityAdjustmentNeeded: false,
          lang: 'fr-fr',
        });
        assessmentSheetRepository.getByAssessmentId.withArgs(assessment.id).resolves(assessmentSheet);

        answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([answer]);
        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId: assessmentSheet.assessmentId })
          .resolves([]);

        sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
          .withArgs(assessmentSheet.certificationCourseId, [answeredChallenge.id])
          .resolves(null);
        sharedChallengeRepository.get.resolves();

        calibratedChallengeRepository.findActiveFlashCompatible
          .withArgs({
            locale: assessmentSheet.lang,
            version,
          })
          .resolves([answeredChallenge]);
        calibratedChallengeRepository.getMany
          .withArgs({ ids: [answeredChallenge.id], version })
          .resolves([answeredChallenge]);

        // when
        const error = await catchErr(getNextChallenge)({
          answerRepository,
          assessmentId: assessment.id,
          sessionManagementCertificationChallengeRepository,
          certificationChallengeLiveAlertRepository,
          calibratedChallengeRepository,
          sharedChallengeRepository,
          versionApi,
          flashAlgorithmService,
          pickChallengeService,
          assessmentSheetRepository,
          complementaryCertificationRepository,
          certificationCandidateId,
        });

        // then
        expect(error).to.be.instanceOf(AssessmentEndedError);
        expect(error.message).to.equal('Evaluation terminée.');
      });
    });

    context('when loading a configuration', function () {
      Object.entries({
        challengesBetweenSameCompetence: 2,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: true,
        variationPercent: 0.2,
        defaultCandidateCapacity: 0,
      })
        .map(([key, value]) => ({
          [key]: value,
        }))
        .forEach((flashConfiguration) => {
          it('should use the configuration', async function () {
            //given
            const nextCalibratedChallenge = domainBuilder.certification.evaluation.buildCalibratedChallenge();
            const challenge = domainBuilder.buildChallenge(nextCalibratedChallenge);

            version = domainBuilder.certification.configuration.buildVersion({
              challengesConfiguration: flashConfiguration,
            });
            versionApi.getById.withArgs({ id: version.id }).resolves(version);

            assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
              certificationCourseId: 123,
              assessmentId: assessment.id,
              userId: 456,
              state: Assessment.states.COMPLETED,
              assessmentUpdatedAt: new Date('2023-10-05'),
              versionId: version.id,
              certificationFramework: Frameworks.EDU_1ER_DEGRE,
              accessibilityAdjustmentNeeded: false,
              lang: 'fr-fr',
            });
            assessmentSheetRepository.getByAssessmentId.withArgs(assessment.id).resolves(assessmentSheet);

            answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
            certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
              .withArgs({
                assessmentId: assessmentSheet.assessmentId,
              })
              .resolves([]);

            sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
              .withArgs(assessmentSheet.certificationCourseId, [])
              .resolves(null);
            sharedChallengeRepository.get.resolves();

            calibratedChallengeRepository.findActiveFlashCompatible
              .withArgs({
                locale: assessmentSheet.lang,
                version,
              })
              .resolves([nextCalibratedChallenge]);
            calibratedChallengeRepository.getMany.withArgs({ ids: [], version }).resolves([]);

            flashAlgorithmService.getCapacityAndErrorRate
              .withArgs({
                allAnswers: [],
                challenges: [nextCalibratedChallenge],
                capacity: version.challengesConfiguration.defaultCandidateCapacity,
                variationPercent: version.challengesConfiguration.variationPercent,
              })
              .returns({ capacity: 0 });

            flashAlgorithmService.getPossibleNextChallenges
              .withArgs({
                availableChallenges: [nextCalibratedChallenge],
                capacity: 0,
              })
              .returns([nextCalibratedChallenge]);

            const getChallengePickerImpl = sinon.stub();
            getChallengePickerImpl
              .withArgs({
                possibleChallenges: [nextCalibratedChallenge],
              })
              .returns(nextCalibratedChallenge);
            pickChallengeService.getChallengePicker.withArgs().returns(getChallengePickerImpl);

            sharedChallengeRepository.get.withArgs(nextCalibratedChallenge.id).resolves(challenge);

            // when
            const returnedChallenge = await getNextChallenge({
              answerRepository,
              assessmentId: assessment.id,
              sessionManagementCertificationChallengeRepository,
              certificationChallengeLiveAlertRepository,
              calibratedChallengeRepository,
              sharedChallengeRepository,
              versionApi,
              flashAlgorithmService,
              assessmentSheetRepository,
              pickChallengeService,
              complementaryCertificationRepository,
            });

            // then
            expect(returnedChallenge).to.equal(challenge);
          });
        });
    });

    context('when the certification is a complementary certification', function () {
      it('should call findActiveFlashCompatible with the version', async function () {
        // given
        answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId: assessmentSheet.assessmentId })
          .resolves([]);

        sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
          .withArgs(assessmentSheet.certificationCourseId, [])
          .resolves(null);
        sharedChallengeRepository.get.resolves();

        version = domainBuilder.certification.configuration.buildVersion({ scope: Frameworks.EDU_CPE });
        versionApi.getById.withArgs({ id: assessmentSheet.versionId }).resolves(version);

        calibratedChallengeRepository.findActiveFlashCompatible.resolves([]);

        // when
        await catchErr(getNextChallenge)({
          answerRepository,
          assessmentId: assessment.id,
          sessionManagementCertificationChallengeRepository,
          certificationChallengeLiveAlertRepository,
          calibratedChallengeRepository,
          sharedChallengeRepository,
          flashAlgorithmService,
          pickChallengeService,
          versionApi,
          assessmentSheetRepository,
          complementaryCertificationRepository,
          certificationCandidateId,
        });

        // then
        expect(calibratedChallengeRepository.findActiveFlashCompatible).to.have.been.calledOnceWithExactly({
          locale: assessmentSheet.lang,
          version,
        });
      });
    });

    context('when the certification is a Pix core or double certification', function () {
      it('should call findActiveFlashCompatible without version', async function () {
        // given
        answerRepository.findByAssessment.withArgs(assessmentSheet.assessmentId).resolves([]);
        certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId
          .withArgs({ assessmentId: assessmentSheet.assessmentId })
          .resolves([]);

        sessionManagementCertificationChallengeRepository.getNextChallengeByCourseId
          .withArgs(assessmentSheet.certificationCourseId, [])
          .resolves(null);
        sharedChallengeRepository.get.resolves();

        calibratedChallengeRepository.findActiveFlashCompatible.resolves([]);

        // when
        await catchErr(getNextChallenge)({
          answerRepository,
          assessmentId: assessment.id,
          sessionManagementCertificationChallengeRepository,
          certificationChallengeLiveAlertRepository,
          calibratedChallengeRepository,
          sharedChallengeRepository,
          flashAlgorithmService,
          pickChallengeService,
          assessmentSheetRepository,
          complementaryCertificationRepository,
          versionApi,
          certificationCandidateId,
        });

        // then
        expect(calibratedChallengeRepository.findActiveFlashCompatible).to.have.been.calledOnceWithExactly({
          locale: assessmentSheet.lang,
          version,
        });
      });
    });
  });

  describe('#candidateCertificationReferential', function () {
    it('returns deduplicated challenges by id', async function () {
      // given
      const challengeListA = [
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL2' }),
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1' }),
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1' }),
      ];

      const challengeListB = [domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1' })];

      const expectedChallengeList = [
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL2' }),
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1' }),
      ];

      // when
      const deduplicatedChallenges = candidateCertificationReferential(challengeListA, challengeListB);

      // then
      expect(deduplicatedChallenges.length).to.equal(2);
      expect(deduplicatedChallenges).to.have.deep.members(expectedChallengeList);
    });

    it('should return challenges with answeredCalibratedChallenges taking precedence over currentCalibratedChallenges', async function () {
      // given
      const answeredCalibratedChallenges = [
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL2' }),
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1', discriminant: 10 }),
      ];

      const currentCalibratedChallenges = [
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1', discriminant: 11 }),
      ];

      const expectedChallengeList = [
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL2' }),
        domainBuilder.certification.evaluation.buildCalibratedChallenge({ id: 'recCHAL1', discriminant: 10 }),
      ];

      // when
      const deduplicatedChallenges = candidateCertificationReferential(
        answeredCalibratedChallenges,
        currentCalibratedChallenges,
      );

      // then
      expect(deduplicatedChallenges.length).to.equal(2);
      expect(deduplicatedChallenges).to.have.deep.members(expectedChallengeList);
    });
  });
});
