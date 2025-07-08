import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | get-combined-course-by-code', function () {
  it('should return CombinedCourse for provided code', async function () {
    const code = 'SOMETHING';
    const questId = databaseBuilder.factory.buildQuest({ code }).id;
    await databaseBuilder.commit();

    const result = await usecases.getCombinedCourseByCode({ code });

    expect(result).to.be.instanceOf(CombinedCourse);
    expect(result.id).to.equal(questId);
  });
  it('should throw an error if CombinedCourse does not exist', async function () {
    const code = 'NOTHINGTT';

    const error = await catchErr(usecases.getCombinedCourseByCode)({ code });

    expect(error).to.be.instanceOf(NotFoundError);
  });
});
