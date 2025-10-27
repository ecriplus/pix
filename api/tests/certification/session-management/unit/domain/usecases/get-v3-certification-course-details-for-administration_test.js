import { getV3CertificationCourseDetailsForAdministration } from '../../../../../../src/certification/session-management/domain/usecases/get-v3-certification-course-details-for-administration.js';
import { AnswerStatus } from '../../../../../../src/shared/domain/models/AnswerStatus.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | get-certification-course-details-for-administration', function () {
  it('should return the details with the associated competence name and number of challenges', async function () {
    // given
    const certificationCourseId = '1234';
    const challengeId = 'challenge1';
    const answerStatus = AnswerStatus.OK;
    const answeredAt = new Date(2020, 2, 1);
    const competenceId = 'competenceId';
    const skillName = 'skillName';
    const competenceName = 'competenceName';
    const competenceIndex = '1.2';
    const reconciledAt = new Date(2024, 1, 15);
    const scope = 'scope';
    const numberOfChallenges = 64;

    const v3CertificationCourseDetailsForAdministrationRepository = {
      getV3DetailsByCertificationCourseId: sinon.stub(),
    };

    const competenceRepository = {
      list: sinon.stub(),
    };

    const certificationCandidateRepository = {
      getByCertificationCourseId: sinon.stub(),
    };

    const sharedCertificationCourseRepository = {
      getCertificationScope: sinon.stub(),
    };

    const evaluationVersionRepository = {
      getByScopeAndReconciliationDate: sinon.stub(),
    };

    const competences = [
      domainBuilder.buildCompetence({
        id: competenceId,
        name: competenceName,
        index: competenceIndex,
      }),
    ];

    const challengeForAdministration = domainBuilder.buildV3CertificationChallengeForAdministration({
      challengeId,
      answerStatus,
      answeredAt,
      competenceId,
      skillName,
    });

    const expectedDetails = domainBuilder.buildV3CertificationCourseDetailsForAdministration({
      certificationCourseId,
      numberOfChallenges: null,
      certificationChallengesForAdministration: [challengeForAdministration],
    });

    const candidate = domainBuilder.buildCertificationCandidate({
      reconciledAt,
    });

    const version = {
      challengesConfiguration: {
        maximumAssessmentLength: numberOfChallenges,
      },
    };

    v3CertificationCourseDetailsForAdministrationRepository.getV3DetailsByCertificationCourseId
      .withArgs({ certificationCourseId })
      .returns(expectedDetails);

    competenceRepository.list.resolves(competences);

    certificationCandidateRepository.getByCertificationCourseId.withArgs({ certificationCourseId }).resolves(candidate);

    sharedCertificationCourseRepository.getCertificationScope
      .withArgs({ courseId: certificationCourseId })
      .resolves(scope);

    evaluationVersionRepository.getByScopeAndReconciliationDate
      .withArgs({ scope, reconciliationDate: reconciledAt })
      .resolves(version);

    // when
    const details = await getV3CertificationCourseDetailsForAdministration({
      certificationCourseId,
      v3CertificationCourseDetailsForAdministrationRepository,
      competenceRepository,
      certificationCandidateRepository,
      sharedCertificationCourseRepository,
      evaluationVersionRepository,
    });

    // then
    expect(details).to.deep.equal({
      ...expectedDetails,
      numberOfChallenges,
      certificationChallengesForAdministration: [
        {
          ...challengeForAdministration,
          competenceName,
          competenceIndex,
        },
      ],
    });
  });
});
