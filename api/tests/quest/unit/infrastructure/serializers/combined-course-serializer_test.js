import { CombinedCourseStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { ITEM_TYPE } from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import * as combinedCourseSerializer from '../../../../../src/quest/infrastructure/serializers/combined-course-serializer.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | Serializers | combined-course', function () {
  it('#serialize', function () {
    // given
    const combinedCourse = domainBuilder.buildCombinedCourseDetails();

    // when
    const serializedCombinedCourse = combinedCourseSerializer.serialize(combinedCourse);

    // then
    expect(serializedCombinedCourse).to.deep.equal({
      data: {
        attributes: {
          name: 'Mon parcours',
          code: 'COMBINIX1',
          'organization-id': 1,
          status: CombinedCourseStatuses.NOT_STARTED,
        },
        type: 'combined-courses',
        id: '1',
        relationships: {
          items: {
            data: [{ id: '1', type: 'combined-course-items' }],
          },
        },
      },
      included: [
        {
          type: 'combined-course-items',
          id: '1',
          attributes: {
            title: 'diagnostique',
            reference: 'ABCDIAG1',
            type: ITEM_TYPE.CAMPAIGN,
          },
        },
      ],
    });
  });
});
