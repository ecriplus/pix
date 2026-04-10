import { usecases } from '../../../../../../src/certification/evaluation/domain/usecases/index.js';
import { ForbiddenAccess, NotFoundError } from '../../../../../../src/shared/domain/errors.js';
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

    context('when user submitting the answer is not the owner of the certification test', function () {
      it('throws a ForbiddenAccess error', async function () {
        certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        databaseBuilder.factory.buildAssessment({ certificationCourseId });
        await databaseBuilder.commit();

        const err = await catchErr(evaluateAndSaveAnswer)({
          certificationCourseId,
          userId: 1111111111,
        });

        expect(err).to.deepEqualInstance(
          new ForbiddenAccess('User is not allowed to add an answer for this certification test.'),
        );
      });
    });

    context('when user submitting the answer is the owner of the certification test', function () {
      let userId;

      beforeEach(function () {
        userId = databaseBuilder.factory.buildUser().id;
        certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ userId }).id;
        databaseBuilder.factory.buildAssessment({ certificationCourseId, userId });
        return databaseBuilder.commit();
      });

      it('returns coucou', async function () {
        const evaluatedAnswer = await evaluateAndSaveAnswer({
          certificationCourseId,
          userId,
        });

        expect(evaluatedAnswer).to.equal('coucou');
      });
    });
  });
});
