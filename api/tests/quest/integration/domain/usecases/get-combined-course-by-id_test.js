import { CombinedCourseDetails } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Domain | Usecases | getCombinedCourseById', function () {
  it('should return a CombinedCourseDetails instance with quest and combined course data', async function () {
    // given
    const organizationId = databaseBuilder.factory.buildOrganization().id;

    const combinedCourseId = databaseBuilder.factory.buildCombinedCourse({
      name: 'Test Combined Course',
      description: 'A test combined course description',
      illustration: 'https://example.com/image.png',
      code: 'TEST_COURSE_123',
      organizationId,
      eligibilityRequirements: [],
      successRequirements: [
        {
          data: { status: { data: 'SHARED', comparison: 'equal' }, campaignId: { data: 100, comparison: 'equal' } },
          comparison: 'all',
          requirement_type: 'campaignParticipations',
        },
        {
          data: { status: { data: 'SHARED', comparison: 'equal' }, campaignId: { data: 200, comparison: 'equal' } },
          comparison: 'all',
          requirement_type: 'campaignParticipations',
        },
        {
          data: { status: { data: 'SHARED', comparison: 'equal' }, campaignId: { data: 300, comparison: 'equal' } },
          comparison: 'all',
          requirement_type: 'campaignParticipations',
        },
      ],
    }).id;

    await databaseBuilder.commit();

    // when
    const result = await usecases.getCombinedCourseById({
      combinedCourseId,
    });

    // then
    expect(result).to.be.instanceOf(CombinedCourseDetails);
    expect(result.id).to.equal(combinedCourseId);
    expect(result.name).to.equal('Test Combined Course');
    expect(result.description).to.equal('A test combined course description');
    expect(result.illustration).to.equal('https://example.com/image.png');
    expect(result.code).to.equal('TEST_COURSE_123');
    expect(result.organizationId).to.equal(organizationId);
    expect(result.campaignIds).to.deep.equal([100, 200, 300]);
  });

  it('should throw if quest is not combined course', async function () {
    // when
    const error = await catchErr(usecases.getCombinedCourseById)({
      combinedCourseId: 12,
    });

    // then
    expect(error).to.be.instanceOf(NotFoundError);
  });
});
