import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import { serialize } from '../../../../../src/quest/infrastructure/serializers/combined-course-participation-serializer.js';
import { expect } from '../../../../test-helper.js';

describe('CombinedCourseParticipationSerializer', function () {
  it('should serialize a CombinedCourseParticipation', function () {
    const combinedCourseParticipation = new CombinedCourseParticipation({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      questId: 123,
      organizationLearnerId: 456,
      status: 'COMPLETED',
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z'),
    });

    const serialized = serialize(combinedCourseParticipation);

    expect(serialized).to.deep.equal({
      data: {
        type: 'combined-course-participations',
        id: '1',
        attributes: {
          'first-name': 'John',
          'last-name': 'Doe',
          status: 'COMPLETED',
          'created-at': new Date('2023-01-01T00:00:00Z'),
          'updated-at': new Date('2023-01-02T00:00:00Z'),
        },
      },
    });
  });
});
