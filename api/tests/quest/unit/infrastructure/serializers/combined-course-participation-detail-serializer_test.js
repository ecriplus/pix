import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import { serialize } from '../../../../../src/quest/infrastructure/serializers/combined-course-participation-detail-serializer.js';
import { expect } from '../../../../test-helper.js';

describe('CombinedCourseParticipationSerializer', function () {
  it('should serialize a CombinedCourseParticipationDetail', function () {
    const combinedCourseParticipation = new CombinedCourseParticipation({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      status: CombinedCourseParticipationStatuses.COMPLETED,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z'),
    });

    const serialized = serialize(combinedCourseParticipation);

    expect(serialized).to.deep.equal({
      data: {
        type: 'combined-course-participation-details',
        id: '1',
        attributes: {
          'first-name': 'John',
          'last-name': 'Doe',
        },
      },
    });
  });
});
