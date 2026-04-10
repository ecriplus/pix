import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../../test-helper.js';

const { evaluateAndSaveAnswer } = usecases;

describe('Certification | Evaluation | Integration | Domain | UseCase | evaluate-and-save-answer', function () {
  context('when certification does not exist', function () {
    it('throws a NotFound error', async function () {
      const err = await catchErr(evaluateAndSaveAnswer)({
        certificationCourseId: 123,
      });

      expect(err).to.deepEqualInstance(new NotFoundError('No certification test found with id 123'));
    });
  });

  context('when certification does exist', function () {
    let certificationCourseId;

    beforeEach(function () {
      certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
      databaseBuilder.factory.buildAssessment({ certificationCourseId });
      return databaseBuilder.commit();
    });

    it('returns coucou', async function () {
      const evaluatedAnswer = await evaluateAndSaveAnswer({
        certificationCourseId,
      });

      expect(evaluatedAnswer).to.equal('coucou');
    });
  });
});
