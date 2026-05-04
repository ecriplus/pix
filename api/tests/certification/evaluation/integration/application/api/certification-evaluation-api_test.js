import sinon from 'sinon';

import * as certificationEvaluationApi from '../../../../../../src/certification/evaluation/application/api/certification-evaluation-api.js';
import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { AlgorithmEngineVersion } from '../../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { CertificationIssueReportCategory } from '../../../../../../src/certification/shared/domain/models/CertificationIssueReportCategory.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { expect } from '../../../../../test-helper.js';
import { databaseBuilder } from '../../../../../tooling/databases.js';

describe('Integration | Application | Certification | Evaluation | API', function () {
  describe('#selectNextCertificationChallenge', function () {
    it('should call the next challenge selection usecase', async function () {
      // given
      const locale = 'fr-fr';
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
        id: 99,
      });
      const certificationCourseId = 123;
      const session = databaseBuilder.factory.buildSession({ certificationCenterId: certificationCenter.id });

      databaseBuilder.factory.buildCertificationIssueReport({
        certificationCourseId: certificationCourseId,
        category: CertificationIssueReportCategory.OTHER,
        description: "il s'est enfuit de la session",
      });

      const assessment = databaseBuilder.factory.buildAssessment({
        certificationCourseId: certificationCourseId,
        type: Assessment.types.CERTIFICATION,
      });

      const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
        id: certificationCourseId,
        assessmentId: assessment.id,
        sessionId: session.id,
        version: AlgorithmEngineVersion.V3,
      });

      databaseBuilder.factory.buildCertificationCandidate({
        userId: certificationCourse.userId,
        sessionId: session.id,
        accessibilityAdjustmentNeeded: false,
      });

      databaseBuilder.factory.buildCertificationVersion();
      await databaseBuilder.commit();

      const usecase = sinon.stub(usecases, 'getNextChallenge');

      // when
      await certificationEvaluationApi.selectNextCertificationChallenge({
        assessmentId: assessment.id,
        locale,
      });

      // then
      expect(usecase).to.have.been.calledOnceWithExactly({
        assessmentId: assessment.id,
        locale,
      });
    });
  });
});
